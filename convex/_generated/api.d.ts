/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_validators from "../lib/validators.js";
import type * as lib_voice_adviceCatalog from "../lib/voice/adviceCatalog.js";
import type * as lib_voice_audioCache from "../lib/voice/audioCache.js";
import type * as lib_voice_elevenLabsTts from "../lib/voice/elevenLabsTts.js";
import type * as lib_voice_synthesizeAdvice from "../lib/voice/synthesizeAdvice.js";
import type * as lib_voice_voiceLimits from "../lib/voice/voiceLimits.js";
import type * as lib_voice_voiceQuotaStore from "../lib/voice/voiceQuotaStore.js";
import type * as scenarios from "../scenarios.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as voice from "../voice.js";
import type * as voiceQuota from "../voiceQuota.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/validators": typeof lib_validators;
  "lib/voice/adviceCatalog": typeof lib_voice_adviceCatalog;
  "lib/voice/audioCache": typeof lib_voice_audioCache;
  "lib/voice/elevenLabsTts": typeof lib_voice_elevenLabsTts;
  "lib/voice/synthesizeAdvice": typeof lib_voice_synthesizeAdvice;
  "lib/voice/voiceLimits": typeof lib_voice_voiceLimits;
  "lib/voice/voiceQuotaStore": typeof lib_voice_voiceQuotaStore;
  scenarios: typeof scenarios;
  seed: typeof seed;
  seedData: typeof seedData;
  voice: typeof voice;
  voiceQuota: typeof voiceQuota;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
