import { d as decode } from "./index-00ee18ac.js";
function timesMap(times2, callback) {
  return Array.from(timesMapIterable(times2, callback));
}
function* timesMapIterable(times2, callback) {
  if (times2 < 1)
    return;
  let index = 0;
  while (index < times2) {
    yield callback(index, times2);
    index += 1;
  }
}
function chunk(sliceable, chunkSize, maxChunks = Infinity) {
  return [...chunkIterable(sliceable, chunkSize, maxChunks)];
}
function* chunkIterable(sliceable, chunkSize, maxChunks = Infinity) {
  const input = sliceable[Symbol.iterator]();
  while (maxChunks > 0) {
    const chunk2 = [];
    while (chunk2.length < chunkSize) {
      const output = input.next();
      if (output.done) {
        if (chunk2.length > 0)
          yield chunk2;
        return;
      } else {
        chunk2.push(output.value);
      }
    }
    yield chunk2;
    maxChunks -= 1;
  }
}
function intToBits(number, size) {
  const encoded = number.toString(2);
  return "0".repeat(size - encoded.length) + encoded;
}
function bitsToSint(binaryString) {
  const compliment = binaryString.slice(0, 1);
  const numericBits = binaryString.slice(1);
  const absolute = parseInt(numericBits, 2);
  return compliment === "0" ? +absolute : -absolute;
}
function bytesToBits(byteArray) {
  return Array.from(byteArray, (x) => intToBits(x, 8)).join("");
}
function bytesToPrefixBits(byteArray, prefixBitLength = 0) {
  return bytesToBits([...byteArray].slice(0, Math.ceil(prefixBitLength / 8))).slice(0, prefixBitLength);
}
function unpack(bytes, bitPrecision, totalFloats) {
  const bits = bytesToBits(bytes);
  return timesMap(totalFloats, (index) => {
    const sint = bitsToSint(bits.slice(index * bitPrecision, (index + 1) * bitPrecision));
    return sint / (2 ** (bitPrecision - 1) - 1);
  });
}
function add(...vectors) {
  return vectors.reduce((a, b) => a.map((num, idx) => num + b[idx]));
}
function multiply(list, mul) {
  return list.map((left) => left.map((n, i) => n * mul[i]));
}
function mean(...list) {
  return multiply([add(...list)], build(1 / list.length, list[0].length))[0];
}
function build(value, size) {
  return new Array(size).fill(value, 0, size);
}
function distanceSquared(a, b) {
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    result += diff * diff;
  }
  return result;
}
function diversity(...vectors) {
  if (vectors.length <= 1)
    return [0];
  const meanVector = mean(...vectors);
  return vectors.map((v) => distanceSquared(v, meanVector));
}
async function open(path) {
  return await freshen({ path, tags: /* @__PURE__ */ new Set(), index: [], settings: {} });
}
function parseIndex(data) {
  const { settings, symbols, index } = decode(data);
  if (settings.version !== 4)
    throw new Error("Unsupported dataset format version");
  symbols.forEach((value, index2) => {
    if (typeof value !== "string") {
      symbols[index2] = unpack(value, settings.vectorBits, settings.vectorSize);
    }
  });
  return {
    settings,
    tags: new Set(Object.keys(index).flatMap((x) => x.split(",").map((id) => symbols[id]))),
    index: Object.entries(index).flatMap(([tagSymbols, entries]) => {
      const tags = tagSymbols.split(",").map((id) => symbols[id]);
      return Object.entries(entries).flatMap(([wordSymbols, paths]) => {
        const words = wordSymbols.split(",").map((id) => symbols[id]);
        const diversity$1 = Math.max(...diversity(...words.filter((x) => typeof x !== "string")));
        return chunk(paths, 2).map((path) => {
          return { words, tags, diversity: diversity$1, path };
        });
      });
    })
  };
}
async function freshen(library) {
  const headers = {};
  if (library.etag)
    headers["If-None-Match"] = library.etag;
  if (library.lastModified)
    headers["If-Modified-Since"] = library.lastModified;
  const response = await fetch(`${library.path}/index.cbor`, { headers, mode: "cors" });
  if (response.status === 304)
    return library;
  else if (response.status !== 200)
    console.warn("server response weird", response);
  return {
    ...library,
    ...parseIndex(await response.arrayBuffer()),
    etag: response.headers.get("ETag"),
    lastModified: response.headers.get("Last-Modified")
  };
}
async function getResult(library, entry) {
  const [shardNumber, item] = entry.path;
  const shardURL = `${library.path}/definitions/${library.settings.buildID}/${shardNumber}.cbor`;
  const response = await fetch(shardURL, { mode: "cors", cache: "force-cache" });
  const shard = decode(await response.arrayBuffer());
  return {
    library,
    ...shard[item],
    media: shard[item].media.map((paths) => {
      return library.settings.mediaSets.map((mediaSet) => {
        const path = paths[mediaSet.extension];
        const src = `${library.path}/media/${path}`;
        return Object.assign(Object.create(mediaSet), { path, src });
      });
    })
  };
}
async function getResultByPath(library, provider, id) {
  if (!library.dataPaths) {
    const response = await fetch(library.path + "/data-paths.cbor", { mode: "cors", cache: "default" });
    library.dataPaths = decode(await response.arrayBuffer());
  }
  return await getResult(library, {
    path: library.dataPaths[provider][id],
    words: [],
    tags: [],
    diversity: 0
  });
}
export { build as a, bytesToPrefixBits as b, chunkIterable as c, distanceSquared as d, getResult as e, getResultByPath as g, multiply as m, open as o, unpack as u };
