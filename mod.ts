import { s32decode, s32encode } from './utils/s32.ts';

let lastTimestamp: number = 0;

const TID_RE = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;

/**
 * Creates a TID based off provided timestamp and clockid, with no validation.
 */
export const createRaw = (timestamp: number, clockid: number): string => {
	return s32encode(timestamp).padStart(11, '2') + s32encode(clockid).padStart(2, '2');
};

/**
 * Return a TID based on current time
 */
export const now = (): string => {
	// we need these two aspects, which Date.now() doesn't provide:
	// - monotonically increasing time
	// - microsecond precision

	// while `performance.timeOrigin + performance.now()` could be used here, they
	// seem to have cross-browser differences, not sure on that yet.

	// deno-lint-ignore prefer-const
	let id = Math.floor(Math.random() * 1023);
	let timestamp = Math.max(Date.now() * 1_000, lastTimestamp);

	if (timestamp === lastTimestamp) {
		timestamp += 1;
	}

	lastTimestamp = timestamp;

	return createRaw(timestamp, id);
};

/**
 * Creates a TID based off provided timestamp and clockid
 */
export const create = (timestamp: number, clockid: number): string => {
	if (timestamp < 0 || !Number.isSafeInteger(timestamp)) {
		throw new Error(`Invalid timestamp`);
	}

	if (clockid < 0 || clockid > 1024) {
		throw new Error(`Invalid clockid`);
	}

	return createRaw(timestamp, clockid);
};

/**
 * Parses a TID, throws on invalid strings.
 */
export const parse = (tid: string): { timestamp: number; clockid: number } => {
	if (tid.length !== 13) {
		throw new Error(`Incorrect TID length`);
	}

	if (!TID_RE.test(tid)) {
		throw new Error(`Invalid TID`);
	}

	const timestamp = s32decode(tid.slice(0, 11));
	const clockid = s32decode(tid.slice(11, 13));

	return { timestamp: timestamp, clockid: clockid };
};
