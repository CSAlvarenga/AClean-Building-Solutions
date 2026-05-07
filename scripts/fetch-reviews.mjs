#!/usr/bin/env node
/**
 * Fetches AClean Building Solutions reviews from the Google Places API (v1 / New).
 * Writes results to src/data/reviews.json.
 *
 * Usage: npm run fetch-reviews
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname  = dirname(fileURLToPath(import.meta.url))
const rootDir    = resolve(__dirname, '..')
const outputPath = resolve(rootDir, 'src/data/reviews.json')

const BUSINESS_NAME    = 'AClean Building Solutions'
const MAPS_URL         = 'https://maps.google.com/?cid=6892143774555714101'
const REVIEWS_URL      = 'https://maps.app.goo.gl/MaeuJpk7uLv8nYnz9'
const WRITE_REVIEW_URL = 'https://g.page/r/CTUyUC8_0KVfEAE/review'

function loadEnv() {
  const envPath = resolve(rootDir, '.env')
  if (!existsSync(envPath)) return {}
  const env = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && val) env[key] = val
  }
  return env
}

function toUnixTime(publishTime) {
  return Math.floor(new Date(publishTime).getTime() / 1000)
}

function relativeDescription(publishTime) {
  const diffMs  = Date.now() - new Date(publishTime).getTime()
  const days    = Math.floor(diffMs / 86400000)
  if (days < 14)  return 'a week ago'
  if (days < 45)  return `${Math.round(days / 7)} weeks ago`
  if (days < 365) return `${Math.round(days / 30)} months ago`
  return `${Math.round(days / 365)} year${Math.round(days / 365) > 1 ? 's' : ''} ago`
}

async function main() {
  const env    = loadEnv()
  const apiKey = env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    console.error('❌  GOOGLE_PLACES_API_KEY not found in .env')
    process.exit(1)
  }

  const placeId = env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID || 'ChIJmUMh9XNBsq4RNTJQLz_QpV8'
  console.log(`📍  Using Place ID: ${placeId}`)
  console.log('📡  Fetching via Places API v1...')

  const fields = 'id,displayName,formattedAddress,rating,userRatingCount,reviews'
  const res  = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fields,
    },
  })
  const data = await res.json()

  if (data.error) {
    throw new Error(`Places API v1 error: ${data.error.status} — ${data.error.message}`)
  }

  // Strip street number — show city, state, zip only
  const fullAddress = data.formattedAddress || ''
  const addressParts = fullAddress.split(', ')
  const address = addressParts.length > 1 ? addressParts.slice(1).join(', ') : fullAddress

  const reviews = (data.reviews || [])
    .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    .map(rev => ({
      author_name:               rev.authorAttribution?.displayName || 'Anonymous',
      author_url:                rev.authorAttribution?.uri || '',
      profile_photo_url:         rev.authorAttribution?.photoUri || '',
      rating:                    rev.rating ?? 5,
      text:                      rev.text?.text || rev.originalText?.text || '',
      time:                      toUnixTime(rev.publishTime),
      relative_time_description: rev.relativePublishTimeDescription || relativeDescription(rev.publishTime),
    }))

  const output = {
    place_id:         placeId,
    place_name:       data.displayName?.text || BUSINESS_NAME,
    address,
    rating:           data.rating ?? 5,
    total_reviews:    data.userRatingCount ?? 0,
    maps_url:         MAPS_URL,
    reviews_url:      REVIEWS_URL,
    write_review_url: WRITE_REVIEW_URL,
    fetched_at:       new Date().toISOString(),
    reviews,
  }

  writeFileSync(outputPath, JSON.stringify(output, null, 2))
  console.log(`✅  Saved ${reviews.length} review(s) to src/data/reviews.json`)
  console.log(`    ⭐  ${data.rating}/5 based on ${data.userRatingCount} total reviews`)
}

main().catch(err => {
  console.error('❌ ', err.message)
  process.exit(1)
})
