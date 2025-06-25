import { TextEncoder, TextDecoder } from 'util';
import { TransformStream } from 'stream/web';

Object.assign(globalThis, { TextEncoder, TextDecoder, TransformStream });
