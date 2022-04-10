const cbor_break_sym = Symbol("CBOR-break");
const cbor_done_sym = Symbol("CBOR-done");
const cbor_eoc_sym = Symbol("CBOR-EOC");
function cbor_accum(base) {
  return (iv) => ({
    __proto__: base,
    res: base.init(iv)
  });
}
const cbor_tag = {
  [Symbol.toStringTag]: "cbor_tag",
  from(tag, body) {
    return { __proto__: this, tag, body };
  },
  to_cbor_encode(enc_ctx, v2) {
    enc_ctx.tag_encode(v2.tag, v2.body);
  }
};
const cbor_nest = {
  [Symbol.toStringTag]: "cbor_nest",
  from(body) {
    return { __proto__: this, body };
  },
  to_cbor_encode(enc_ctx, v2) {
    let { body, u8 } = v2;
    enc_ctx.nest(body, "body" in v2 ? null : u8);
  },
  with_ctx(ctx2) {
    let self = {
      __proto__: this,
      decode_cbor() {
        return this.body = ctx2.from_nested_u8(this.u8).decode_cbor();
      }
    };
    return (u8) => ({ __proto__: self, u8 });
  }
};
/* @__PURE__ */ Array.from(Array(256), (_, v2) => v2.toString(2).padStart(8, "0"));
/* @__PURE__ */ Array.from(Array(256), (_, v2) => v2.toString(16).padStart(2, "0"));
function u8_to_utf8(u8) {
  return new TextDecoder("utf-8").decode(u8);
}
function utf8_to_u8(utf8) {
  return new TextEncoder("utf-8").encode(utf8);
}
typeof crypto !== "undefined" ? crypto.getRandomValues.bind(crypto) : import("node:crypto".trim()).then((m) => m.randomFillSync);
function as_u8_buffer(u8) {
  if (u8 instanceof Uint8Array) {
    return u8;
  }
  if (ArrayBuffer.isView(u8)) {
    return new Uint8Array(u8.buffer);
  }
  if (u8 instanceof ArrayBuffer) {
    return new Uint8Array(u8);
  }
  return Uint8Array.from(u8);
}
function u8_concat(parts) {
  let i = 0, len = 0;
  for (const b of parts) {
    const byteLength = b.byteLength;
    if (typeof byteLength !== "number") {
      throw new Error("Invalid part byteLength");
    }
    len += byteLength;
  }
  const u8 = new Uint8Array(len);
  for (const u8_part of parts) {
    u8.set(u8_part, i);
    i += u8_part.byteLength;
  }
  return u8;
}
async function* u8_as_stream(u8) {
  yield as_u8_buffer(u8);
}
const _obj_kind_ = Function.call.bind(Object.prototype.toString);
function bind_encode_dispatch(ctx0, api) {
  let active_enc = /* @__PURE__ */ new WeakSet();
  let simple_map, encode_object, lut_types;
  api.rebind = rebind;
  return (ctx2) => {
    ctx2.encode = (v2) => encode(v2, ctx2);
    ctx2.encode_object = (v2) => encode_object(v2, ctx2);
  };
  function rebind(host = ctx0.host) {
    active_enc = /* @__PURE__ */ new WeakSet();
    Object.defineProperties(ctx0, {
      host: { value: host }
    });
    simple_map = host._simple_map;
    lut_types = new Map(lut_common_types);
    for (const [k, fn] of host._encoder_map.entries()) {
      if (typeof k === "string" && typeof fn === "function") {
        lut_types.set(k, fn);
      }
    }
    if (host.bind_encode_object) {
      encode_object = host.bind_encode_object(ctx0, lut_types);
    } else if (host.encode_object) {
      encode_object = host.encode_object;
    }
    if (encode_object) {
      lut_types.set(_obj_kind_({}), encode_object);
    } else
      encode_object = lut_types.get(_obj_kind_({}));
    return api;
  }
  function encode(v2, ctx2) {
    let ev = lut_fast_w0.get(v2);
    if (ev !== void 0) {
      ctx2.add_w0(ev);
      return;
    }
    if (simple_map !== void 0) {
      let sv = simple_map.get(v2);
      if (sv !== void 0) {
        ctx2.simple(sv);
        return;
      }
    }
    if (v2.to_cbor_encode !== void 0) {
      if (!active_enc.has(v2)) {
        active_enc.add(v2);
        try {
          return v2.to_cbor_encode(ctx2, v2);
        } finally {
          active_enc.delete(v2);
        }
      }
    }
    let encoder = lut_types.get(_obj_kind_(v2));
    if (encoder !== void 0) {
      return encoder(v2, ctx2);
    }
    return encode_object(v2, ctx2);
  }
}
const lut_fast_w0 = new Map([
  [false, 244],
  [true, 245],
  [null, 246],
  [void 0, 247],
  ...Array.from({ length: 24 }, (v2, i) => [i, i]),
  ...Array.from({ length: 24 }, (v2, i) => [-i - 1, 32 + i])
]);
const cu8_f32_nan = new Uint8Array([250, 127, 192, 0, 0]);
const cu8_f32_neg_zero = new Uint8Array([250, 128, 0, 0, 0]);
const lut_fp_raw = /* @__PURE__ */ new Map([
  [-0, cu8_f32_neg_zero],
  [NaN, cu8_f32_nan],
  [Infinity, new Uint8Array([250, 127, 128, 0, 0])],
  [-Infinity, new Uint8Array([250, 255, 128, 0, 0])]
]);
function encode_number(v2, ctx2) {
  if (!Number.isSafeInteger(v2)) {
    const raw = lut_fp_raw.get(v2);
    if (raw === void 0) {
      ctx2.float64(v2);
    } else {
      ctx2.raw_frame(raw);
    }
  } else if (v2 > 0) {
    ctx2.add_mask(0, v2);
  } else if (v2 < 0) {
    ctx2.add_mask(32, -1 - v2);
  } else if (Object.is(-0, v2)) {
    ctx2.raw_frame(cu8_f32_neg_zero);
  } else {
    ctx2.add_w0(0);
  }
}
function use_encoder_for(lut_types, example, encoder) {
  let kind = _obj_kind_(example);
  lut_types.set(kind, encoder);
  return kind;
}
const lut_common_types = bind_builtin_types(/* @__PURE__ */ new Map());
function bind_builtin_types(lut_types) {
  use_encoder_for(lut_types, NaN, (v2, ctx2) => {
    ctx2.raw_frame(cu8_f32_nan);
  });
  use_encoder_for(lut_types, void 0, (v2, ctx2) => {
    ctx2.add_w0(247);
  });
  use_encoder_for(lut_types, null, (v2, ctx2) => {
    ctx2.add_w0(246);
  });
  use_encoder_for(lut_types, true, (v2, ctx2) => {
    ctx2.add_w0(v2 ? 245 : 244);
  });
  use_encoder_for(lut_types, "utf8", (v2, ctx2) => {
    ctx2.add_utf8(v2);
  });
  use_encoder_for(lut_types, 42, encode_number);
  use_encoder_for(lut_types, 42.1, encode_number);
  use_encoder_for(lut_types, [], (v2, ctx2) => {
    ctx2.array(v2);
  });
  use_encoder_for(lut_types, {}, (v2, ctx2) => {
    ctx2.object_pairs(v2);
  });
  use_encoder_for(lut_types, parseInt, () => {
    ctx.invalid("function");
  });
  use_encoder_for(lut_types, Symbol.iterator, () => {
    ctx.invalid("symbol");
  });
  {
    let encode_bytes = function(v2, ctx2) {
      ctx2.add_bytes(v2);
    };
    let ab = new ArrayBuffer(0);
    use_encoder_for(lut_types, ab, encode_bytes);
    use_encoder_for(lut_types, new DataView(ab), encode_bytes);
    use_encoder_for(lut_types, new Uint8Array(ab), encode_bytes);
  }
  return lut_types;
}
const W1 = 24, W2 = 25, W4 = 26, W8 = 27;
const ctx_prototype = {
  __proto__: null,
  invalid() {
    this.add_w0(247);
  },
  simple(v2) {
    if (v2 < 24) {
      this.add_w0(224 | v2);
    } else if (v2 <= 255) {
      this.add_w1(248, v2);
    } else
      throw new Error(`Invalid simple value: ${v2}`);
  },
  tag_encode(tag, value) {
    let end_tag = this.tag(tag);
    this.encode(value);
    return end_tag();
  },
  tag_encode_object(tag, value) {
    let end_tag = this.tag(tag);
    this.encode_object(value);
    return end_tag();
  },
  tag(tag, with_tag) {
    if (tag === true) {
      tag = 55799;
    }
    this.add_mask(192, tag);
    return with_tag || this.host.with_tag(tag);
  },
  shared_tag(obj_key) {
    let refs = this._ref_wm;
    if (refs === void 0) {
      (this._ref_wm = refs = /* @__PURE__ */ new WeakMap()).n = 0;
    }
    let ref_id = refs.get(obj_key);
    if (ref_id === void 0) {
      ref_id = refs.n++;
      refs.set(obj_key, ref_id);
      return this.tag(28);
    } else {
      this.add_mask(192, 29);
      this.add_int(ref_id);
    }
  },
  shared(obj_key, value = obj_key) {
    let end_tag = this.shared_tag(obj_key);
    if (end_tag !== void 0) {
      this.encode(value);
      return end_tag();
    }
  },
  shared_object(obj_key, value = obj_key) {
    let end_tag = this.shared_tag(obj_key);
    if (end_tag !== void 0) {
      this.encode_object(value);
      return end_tag();
    }
  },
  add_int(v2) {
    if (!Number.isSafeInteger(v2)) {
      throw new TypeError();
    }
    if (v2 > 0) {
      this.add_mask(0, v2);
    } else if (v2 < 0) {
      this.add_mask(32, -1 - v2);
    } else {
      this.add_w0(0);
    }
  },
  sub_encode(v2, opt) {
    let fn = this.sub_encode = bind_encoder_context().rebind(this.host);
    return fn(v2, opt);
  },
  nest(v2, u8_pre) {
    let end_tag = this.tag(24);
    this.add_buffer(64, u8_pre || this.sub_encode(v2));
    return end_tag();
  },
  bytes_stream(iterable) {
    let { add_w0, add_bytes } = this;
    add_w0(95);
    for (let v2 of iterable) {
      add_bytes(v2);
    }
    add_w0(255);
  },
  utf8_stream(iterable) {
    let { add_w0, add_utf8 } = this;
    add_w0(127);
    for (let v2 of iterable) {
      add_utf8(v2);
    }
    add_w0(255);
  },
  array(arr) {
    let { add_mask, encode } = this;
    let len = arr.length;
    add_mask(128, len);
    for (let i = 0; i < len; i++) {
      encode(arr[i]);
    }
  },
  list(iterable, count) {
    let { add_mask, encode } = this;
    add_mask(128, count);
    for (let v2 of iterable) {
      encode(v2);
      if (0 >= count--) {
        return;
      }
    }
  },
  list_stream(iterable) {
    let { add_w0, encode } = this;
    add_w0(159);
    for (let v2 of iterable) {
      encode(v2);
    }
    add_w0(255);
  },
  _object_filter(e) {
    let t = typeof e[1];
    return t !== "function" && t !== "symbol";
  },
  object_pairs(v2) {
    let { add_mask, encode } = this;
    let ns = Object.entries(v2).filter(this._object_filter);
    let count = ns.length;
    add_mask(160, count);
    for (let i = 0; i < count; i++) {
      let e = ns[i];
      encode(e[0]);
      encode(e[1]);
    }
  },
  pairs(iterable, count) {
    let { add_mask, encode } = this;
    add_mask(160, count);
    for (let e of iterable) {
      encode(e[0]);
      encode(e[1]);
      if (0 >= count--) {
        return;
      }
    }
  },
  pair_stream(iterable) {
    let { add_w0, encode } = this;
    add_w0(191);
    for (let e of iterable) {
      encode(e[0]);
      encode(e[1]);
    }
    add_w0(255);
  }
};
function bind_encoder_context(stream) {
  let idx_frame = 0, idx_next = 0;
  if (stream == null) {
    stream = u8concat_outstream();
  } else if (!stream.flush && stream[Symbol.asyncIterator]) {
    stream = aiter_outstream(stream);
  }
  const block_size = stream.block_size || 65536;
  const u8_tip = new Uint8Array(block_size);
  const dv_tip = new DataView(u8_tip.buffer);
  const ctx0 = {
    __proto__: ctx_prototype,
    raw_frame,
    add_w0(bkind) {
      next_frame(bkind, 1);
    },
    add_w1(bkind, v8) {
      u8_tip[next_frame(bkind, 2)] = v8;
    },
    add_mask,
    add_bytes,
    add_utf8,
    add_buffer,
    float16_short(u16) {
      dv_tip.setUint16(next_frame(249, 3), v);
    },
    float32(v2) {
      dv_tip.setFloat32(next_frame(250, 5), v2);
    },
    float64(v2) {
      dv_tip.setFloat64(next_frame(251, 9), v2);
    }
  };
  let bind_ctx = bind_encode_dispatch(ctx0, cbor_encode);
  return cbor_encode;
  function cbor_encode(v2, opt) {
    let ctx2 = { __proto__: ctx0 };
    bind_ctx(ctx2);
    if (opt === void 0 || opt === null) {
      ctx2.encode(v2);
    } else if (opt === true || typeof opt === "number") {
      ctx2.tag_encode(opt, v2);
    } else if (opt.tag) {
      ctx2.tag_encode(opt.tag, v2);
    }
    if (idx_next === 0) {
      return stream.flush(null);
    }
    let blk = u8_tip.slice(0, idx_next);
    idx_frame = idx_next = 0;
    return stream.flush(blk);
  }
  function add_mask(mask, v2) {
    if (v2 <= 65535) {
      if (v2 < 24) {
        next_frame(mask | v2, 1);
      } else if (v2 <= 255) {
        u8_tip[next_frame(mask | W1, 2)] = v2;
      } else {
        dv_tip.setUint16(next_frame(mask | W2, 3), v2);
      }
    } else if (v2 <= 4294967295) {
      dv_tip.setUint32(next_frame(mask | W4, 5), v2);
    } else {
      let idx = next_frame(mask | W8, 9);
      let v_hi = v2 / 4294967296 | 0;
      dv_tip.setUint32(idx, v_hi);
      let v_lo = v2 & 4294967295;
      dv_tip.setUint32(4 + idx, v_lo);
      return;
    }
  }
  function add_bytes(v2) {
    add_buffer(64, as_u8_buffer(v2));
  }
  function add_utf8(v2) {
    add_buffer(96, utf8_to_u8(v2));
  }
  function add_buffer(mask, buf) {
    add_mask(mask, buf.byteLength);
    raw_frame(buf);
  }
  function next_frame(bkind, frameWidth) {
    idx_frame = idx_next;
    idx_next += frameWidth;
    if (idx_next > block_size) {
      stream.write(u8_tip.slice(0, idx_frame));
      idx_frame = 0;
      idx_next = frameWidth;
    }
    u8_tip[idx_frame] = bkind;
    return 1 + idx_frame;
  }
  function raw_frame(buf) {
    let len = buf.byteLength;
    idx_frame = idx_next;
    idx_next += len;
    if (idx_next <= block_size) {
      u8_tip.set(buf, idx_frame);
      return;
    }
    if (idx_frame !== 0) {
      stream.write(u8_tip.slice(0, idx_frame));
    }
    idx_frame = idx_next = 0;
    stream.write(buf);
  }
}
function u8concat_outstream() {
  let blocks = [];
  return {
    write(blk) {
      blocks.push(blk);
    },
    flush(blk) {
      if (blocks.length === 0) {
        return blk;
      }
      if (blk !== null) {
        blocks.push(blk);
      }
      let u8 = u8_concat(blocks);
      blocks = [];
      return u8;
    }
  };
}
function aiter_outstream(aiter_out) {
  let _x_tail;
  return {
    write(blk) {
      _x_tail = aiter_out.next(blk);
    },
    async flush(blk) {
      let tail = blk !== null ? aiter_out.next(blk) : _x_tail;
      _x_tail = null;
      return await tail;
    }
  };
}
class CBOREncoderBasic {
  static get create() {
    return (stream) => new this(stream);
  }
  static get encode() {
    return new this().encode;
  }
  static get encode_stream() {
    return (stream) => new this(stream).encode;
  }
  constructor(stream) {
    this.encode = bind_encoder_context(stream);
    this.rebind();
  }
  rebind() {
    this.encode.rebind(this);
    return this;
  }
  with_tag(tag) {
    return noop;
  }
  encoder_map() {
    if (!Object.hasOwnProperty(this, "_encoder_map")) {
      this._encoder_map = new Map(this._encoder_map);
      this.rebind();
    }
    return this._encoder_map;
  }
  simple_map() {
    if (!Object.hasOwnProperty(this, "_simple_map")) {
      this._simple_map = new Map(this._simple_map);
      this.rebind();
    }
    return this._simple_map;
  }
  with_encoders(fn_block, skip_rebind) {
    let enc_map = this._encoder_map = new Map(this._encoder_map);
    let add_encoder = use_encoder_for.bind(null, enc_map);
    fn_block(add_encoder, this);
    return skip_rebind ? this : this.rebind();
  }
}
CBOREncoderBasic.prototype._encoder_map = /* @__PURE__ */ new Map();
function noop() {
}
const is_big_endian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 0;
const cbor_typed_arrays = [
  [Uint8Array, 64, 64],
  [Uint16Array, 65, 69],
  [Uint32Array, 66, 70],
  [Uint8ClampedArray, 68, 68],
  [Int8Array, 72, 72],
  [Int16Array, 73, 77],
  [Int32Array, 74, 78],
  [Float32Array, 81, 85],
  [Float64Array, 82, 86]
];
function swap_endian(v2) {
  let len = v2.byteLength, step = v2.BYTES_PER_ELEMENT;
  let u8 = new Uint8Array(v2.buffer, v2.byteOffset, len);
  let t, i = 0, j, k;
  while (i < len) {
    j = i;
    k = i + step;
    i = k;
    while (j < k) {
      t = u8[j];
      u8[j++] = u8[--k];
      u8[k] = t;
    }
  }
  return v2;
}
function std_tag_encoders(add_encoder, host) {
  basic_tag_encoders(add_encoder);
  typedarray_tag_encoders(add_encoder);
}
function basic_tag_encoders(add_encoder, host) {
  add_encoder(Promise.resolve(), () => {
    throw new Error("Promises not supported for CBOR encoding");
  });
  add_encoder(new Date(), (v2, ctx2) => {
    let end_tag = ctx2.tag(1);
    ctx2.float64(v2 / 1e3);
    end_tag();
  });
  add_encoder(new URL("ws://h"), (v2, ctx2) => {
    let end_tag = ctx2.tag(32);
    ctx2.add_utf8(v2.toString());
    end_tag();
  });
  add_encoder(/* @__PURE__ */ new Set(), (v2, ctx2) => {
    let end_tag = ctx2.tag(258);
    ctx2.list(v2, v2.size);
    end_tag();
  });
  add_encoder(/* @__PURE__ */ new Map(), (v2, ctx2) => {
    let end_tag = ctx2.tag(259);
    ctx2.pairs(v2.entries(), v2.size);
    end_tag();
  });
}
function typedarray_tag_encoders(add_encoder) {
  let ab = new ArrayBuffer(0);
  for (let [TA_Klass, tag_be, tag_le] of cbor_typed_arrays) {
    if (tag_be === 64) {
      continue;
    }
    add_encoder(new TA_Klass(ab), (v2, ctx2) => {
      if (is_big_endian) {
        v2 = swap_endian(v2.slice());
      }
      let end_tag = ctx2.tag(tag_le);
      ctx2.add_bytes(v2);
      end_tag();
    });
  }
}
class CBOREncoder extends CBOREncoderBasic {
}
CBOREncoder.prototype.with_encoders(std_tag_encoders, true);
class CBORDecoderBase {
  static options(options) {
    return class extends this {
    }.compile(options);
  }
  static compile(options) {
    this.prototype.compile(options);
    return this;
  }
  constructor(options) {
    if (options != null) {
      this.compile(options);
    }
    this._U8Ctx_.bind_decode_api(this);
  }
  compile(options) {
    this.jmp = this._bind_cbor_jmp(options, this.jmp);
    if (options.types) {
      this.types = Object.assign(Object.create(this.types || null), options.types);
    }
    this._U8Ctx_ = this._bind_u8ctx(this.types, this.jmp, options.unknown);
    return this;
  }
}
const decode_types = {
  __proto__: null,
  u32(u8, idx) {
    const u32 = u8[idx] << 24 | u8[idx + 1] << 16 | u8[idx + 2] << 8 | u8[idx + 3];
    return u32 >>> 0;
  },
  u64(u8, idx) {
    const v_hi = u8[idx] << 24 | u8[idx + 1] << 16 | u8[idx + 2] << 8 | u8[idx + 3];
    const v_lo = u8[idx + 4] << 24 | u8[idx + 5] << 16 | u8[idx + 6] << 8 | u8[idx + 7];
    const u64 = (v_lo >>> 0) + 4294967296 * (v_hi >>> 0);
    return u64;
  },
  float16(u8) {
    return { "@f2": u8 };
  },
  float32(u8, idx = u8.byteOffset) {
    return new DataView(u8.buffer, idx, 4).getFloat32(0);
  },
  float64(u8, idx = u8.byteOffset) {
    return new DataView(u8.buffer, idx, 8).getFloat64(0);
  },
  bytes(u8) {
    return u8;
  },
  bytes_stream: cbor_accum({
    init: () => [],
    accum: _res_push,
    done: (res) => u8_concat(res)
  }),
  utf8(u8) {
    return u8_to_utf8(u8);
  },
  utf8_stream: cbor_accum({
    init: () => [],
    accum: _res_push,
    done: (res) => res.join("")
  }),
  list: cbor_accum({
    init: () => [],
    accum: _res_attr
  }),
  list_stream() {
    return this.list();
  },
  map: cbor_accum({
    init: () => ({}),
    accum: _res_attr
  }),
  map_stream() {
    return this.map();
  }
};
function _res_push(res, i, v2) {
  res.push(v2);
}
function _res_attr(res, k, v2) {
  res[k] = v2;
}
const decode_Map = {
  map: cbor_accum({
    init: () => /* @__PURE__ */ new Map(),
    accum: (res, k, v2) => res.set(k, v2)
  })
};
const decode_Set = {
  list: cbor_accum({
    init: () => /* @__PURE__ */ new Set(),
    accum: (res, i, v2) => res.add(v2)
  })
};
function std_tags(tags_lut) {
  basic_tags(tags_lut);
  ext_js_maps_sets(tags_lut);
  ext_typedarray_tags(tags_lut);
  ext_value_sharing_tags(tags_lut);
}
function basic_tags(tags_lut) {
  tags_lut.set(0, () => (ts_sz) => new Date(ts_sz));
  tags_lut.set(1, () => (seconds) => new Date(seconds * 1e3));
  tags_lut.set(24, (ctx2) => cbor_nest.with_ctx(ctx2));
  tags_lut.set(32, () => (url_sz) => new URL(url_sz));
  tags_lut.set(55799, () => {
  });
}
function ext_typedarray_tags(tags_lut) {
  let [i_cpy, i_swp] = is_big_endian ? [1, 2] : [2, 1];
  for (let ta_args of cbor_typed_arrays) {
    let TA_Klass = ta_args[0], step = TA_Klass.BYTES_PER_ELEMENT;
    let as_ta = (u8) => u8.byteOffset % step === 0 ? new TA_Klass(u8.buffer, u8.byteOffset, u8.byteLength / step) : new TA_Klass(u8.slice().buffer);
    tags_lut.set(ta_args[i_cpy], (ctx2) => as_ta);
    tags_lut.set(ta_args[i_swp], (ctx2) => (u8) => swap_endian(as_ta(u8)));
  }
}
function ext_js_maps_sets(tags_lut) {
  tags_lut.set(258, (ctx2) => {
    ctx2.use_overlay(decode_Set);
  });
  tags_lut.set(259, (ctx2) => {
    ctx2.use_overlay(decode_Map);
  });
}
function ext_value_sharing_tags(tags_lut) {
  let sym_ref = Symbol("cbor-shared");
  tags_lut.set(28, (ctx2) => {
    let refs = _refs_for(ctx2);
    let ref_id = refs.n++;
    let complete;
    refs.set(ref_id, new Promise((resolve) => complete = resolve));
    return (v2) => {
      refs.set(ref_id, v2);
      complete(v2);
      return v2;
    };
  });
  tags_lut.set(29, (ctx2) => (ref_id) => _refs_for(ctx2).get(ref_id));
  function _refs_for(ctx2) {
    let refs = ctx2[sym_ref];
    if (refs === void 0) {
      refs = /* @__PURE__ */ new Map();
      refs.n = 0;
      ctx2[sym_ref] = refs;
    }
    return refs;
  }
}
class U8DecodeBaseCtx {
  static subclass(types, jmp, unknown) {
    class U8DecodeCtx_ extends this {
    }
    let { prototype } = U8DecodeCtx_;
    prototype.next_value = U8DecodeCtx_.bind_next_value(jmp, unknown);
    prototype.types = types;
    return U8DecodeCtx_;
  }
  from_nested_u8(u8) {
    return this.constructor.from_u8(u8, this.types);
  }
  use_overlay(overlay_types) {
    let { types, _apply_overlay, _overlay_noop } = this;
    if (_overlay_noop === _apply_overlay) {
      _apply_overlay = () => {
        this.types = types;
      };
    }
    this._apply_overlay = () => {
      this._apply_overlay = _apply_overlay;
      this.types = overlay_types;
    };
    return types;
  }
  _error_unknown(ctx2, type_b) {
    throw new Error(`No CBOR decorder regeistered for ${type_b} (0x${("0" + type_b.toString(16)).slice(-2)})`);
  }
  _overlay_noop() {
  }
}
class U8SyncDecodeCtx extends U8DecodeBaseCtx {
  static bind_decode_api(decoder) {
    decoder.decode = (u8) => this.from_u8(u8, decoder.types).decode_cbor();
    decoder.iter_decode = (u8) => this.from_u8(u8, decoder.types).iter_decode_cbor();
  }
  static get from_u8() {
    const inst0 = new this();
    return (u8, types) => {
      u8 = as_u8_buffer(u8);
      const inst = {
        __proto__: inst0,
        idx: 0,
        u8,
        _apply_overlay: inst0._overlay_noop
      };
      if (types && types !== inst0.types) {
        inst.types = types;
      }
      return inst;
    };
  }
  static bind_next_value(jmp, unknown) {
    if (unknown == null) {
      unknown = this._error_unknown;
    }
    return function next_value() {
      const doneTypes = this._apply_overlay();
      const type_b = this.u8[this.idx++];
      if (type_b === void 0) {
        this.idx--;
        throw cbor_done_sym;
      }
      const decode2 = jmp[type_b] || unknown;
      const res = decode2(this, type_b);
      return doneTypes === void 0 ? res : doneTypes(res);
    };
  }
  decode_cbor() {
    try {
      return this.next_value();
    } catch (e) {
      throw cbor_done_sym !== e ? e : new Error(`End of content`);
    }
  }
  *iter_decode_cbor() {
    try {
      while (1) {
        yield this.next_value();
      }
    } catch (e) {
      if (cbor_done_sym !== e) {
        throw e;
      }
    }
  }
  move(count_bytes) {
    const { idx, byteLength } = this;
    const idx_next = idx + count_bytes;
    if (idx_next >= byteLength) {
      throw cbor_eoc_sym;
    }
    this.idx = idx_next;
    return idx;
  }
}
const _cbor_jmp_base = {
  bind_jmp(options, jmp) {
    jmp = jmp ? jmp.slice() : this.bind_basics_dispatch(/* @__PURE__ */ new Map());
    if (options == null) {
      options = {};
    }
    if (options.simple) {
      this.bind_jmp_simple(options, jmp);
    }
    if (options.tags) {
      this.bind_jmp_tag(options, jmp);
    }
    return jmp;
  },
  bind_jmp_simple(options, jmp) {
    if (options.simple) {
      const as_simple_value = this.bind_simple_dispatch(options.simple);
      const tiny_simple = this.cbor_tiny(as_simple_value);
      for (let i = 224; i <= 243; i++) {
        jmp[i] = tiny_simple;
      }
      jmp[248] = this.cbor_w1(as_simple_value);
    }
    return jmp;
  },
  bind_jmp_tag(options, jmp) {
    if (options.tags) {
      const as_tag = this.bind_tag_dispatch(this.build_tags_lut(options.tags));
      const tiny_tag = this.cbor_tiny(as_tag);
      for (let i = 192; i <= 215; i++) {
        jmp[192 | i] = tiny_tag;
      }
      jmp[216] = this.cbor_w1(as_tag);
      jmp[217] = this.cbor_w2(as_tag);
      jmp[218] = this.cbor_w4(as_tag);
      jmp[219] = this.cbor_w8(as_tag);
    }
    return jmp;
  },
  bind_basics_dispatch(tags_lut) {
    this.bind_tag_dispatch(tags_lut);
    const tiny_pos_int = this.cbor_tiny(this.as_pos_int);
    const tiny_neg_int = this.cbor_tiny(this.as_neg_int);
    const tiny_bytes = this.cbor_tiny(this.as_bytes);
    const tiny_utf8 = this.cbor_tiny(this.as_utf8);
    const tiny_list = this.cbor_tiny(this.as_list);
    const tiny_map = this.cbor_tiny(this.as_map);
    const tiny_tag = this.cbor_tiny(this.as_tag);
    const tiny_simple_repr = this.cbor_tiny(this.as_simple_repr);
    const jmp = new Array(256);
    for (let i = 0; i <= 23; i++) {
      jmp[0 | i] = tiny_pos_int;
      jmp[32 | i] = tiny_neg_int;
      jmp[64 | i] = tiny_bytes;
      jmp[96 | i] = tiny_utf8;
      jmp[128 | i] = tiny_list;
      jmp[160 | i] = tiny_map;
      jmp[192 | i] = tiny_tag;
      jmp[224 | i] = tiny_simple_repr;
    }
    const cbor_widths = [
      this.cbor_w1,
      this.cbor_w2,
      this.cbor_w4,
      this.cbor_w8
    ];
    for (let w = 0; w < 4; w++) {
      const i = 24 + w, cbor_wN = cbor_widths[w];
      jmp[0 | i] = cbor_wN(this.as_pos_int);
      jmp[32 | i] = cbor_wN(this.as_neg_int);
      jmp[64 | i] = cbor_wN(this.as_bytes);
      jmp[96 | i] = cbor_wN(this.as_utf8);
      jmp[128 | i] = cbor_wN(this.as_list);
      jmp[160 | i] = cbor_wN(this.as_map);
      jmp[192 | i] = cbor_wN(this.as_tag);
    }
    jmp[95] = (ctx2) => this.as_stream(ctx2, ctx2.types.bytes_stream());
    jmp[127] = (ctx2) => this.as_stream(ctx2, ctx2.types.utf8_stream());
    jmp[159] = (ctx2) => this.as_stream(ctx2, ctx2.types.list_stream());
    jmp[191] = (ctx2) => this.as_pair_stream(ctx2, ctx2.types.map_stream());
    jmp[244] = () => false;
    jmp[245] = () => true;
    jmp[246] = () => null;
    jmp[247] = () => {
    };
    jmp[248] = this.cbor_w1(this.as_simple_repr);
    jmp[249] = this.as_float16;
    jmp[250] = this.as_float32;
    jmp[251] = this.as_float64;
    jmp[255] = () => cbor_break_sym;
    return jmp;
  },
  as_pos_int: (ctx2, value) => value,
  as_neg_int: (ctx2, value) => -1 - value,
  as_simple_repr: (ctx2, key) => `simple(${key})`,
  bind_simple_dispatch(simple_lut) {
    if (typeof simple_lut.get !== "function") {
      throw new TypeError("Expected a simple_value Map");
    }
    return (ctx2, key) => simple_lut.get(key);
  },
  build_tags_lut(tags) {
    let lut = /* @__PURE__ */ new Map();
    let q = [tags];
    while (q.length !== 0) {
      let tip = q.pop();
      if (tip === true) {
        tip = std_tags;
      }
      if (Array.isArray(tip)) {
        q.push(...tip);
      } else if (tip.from_cbor_decode) {
        tip.from_cbor_decode(lut, cbor_accum);
      } else if (typeof tip === "function") {
        tip(lut, cbor_accum);
      } else {
        for (let [k, v2] of tip.entries()) {
          lut.set(k, v2);
        }
      }
    }
    return lut;
  }
};
const _cbor_jmp_sync = {
  __proto__: _cbor_jmp_base,
  cbor_tiny(as_type) {
    return function w0_as(ctx2, type_b) {
      return as_type(ctx2, type_b & 31);
    };
  },
  cbor_w1(as_type) {
    return function w1_as(ctx2) {
      const idx = ctx2.move(1);
      return as_type(ctx2, ctx2.u8[idx]);
    };
  },
  cbor_w2(as_type) {
    return function w2_as(ctx2) {
      const u8 = ctx2.u8, idx = ctx2.move(2);
      return as_type(ctx2, u8[idx] << 8 | u8[idx + 1]);
    };
  },
  cbor_w4(as_type) {
    return function w4_as(ctx2) {
      const u8 = ctx2.u8, idx = ctx2.move(4);
      return as_type(ctx2, ctx2.types.u32(u8, idx));
    };
  },
  cbor_w8(as_type) {
    return function w8_as(ctx2) {
      const u8 = ctx2.u8, idx = ctx2.move(8);
      return as_type(ctx2, ctx2.types.u64(u8, idx));
    };
  },
  as_bytes(ctx2, len) {
    const u8 = ctx2.u8, idx = ctx2.move(len);
    return ctx2.types.bytes(u8.subarray(idx, idx + len));
  },
  as_utf8(ctx2, len) {
    const u8 = ctx2.u8, idx = ctx2.move(len);
    return ctx2.types.utf8(u8.subarray(idx, idx + len));
  },
  as_list(ctx2, len) {
    const { res, accum, done } = ctx2.types.list(len);
    for (let i = 0; i < len; i++) {
      accum(res, i, ctx2.next_value());
    }
    return done !== void 0 ? done(res) : res;
  },
  as_map(ctx2, len) {
    const { res, accum, done } = ctx2.types.map(len);
    for (let i = 0; i < len; i++) {
      const key = ctx2.next_value();
      const value = ctx2.next_value();
      accum(res, key, value);
    }
    return done !== void 0 ? done(res) : res;
  },
  as_stream(ctx2, { res, accum, done }) {
    let i = 0;
    while (true) {
      const value = ctx2.next_value();
      if (cbor_break_sym === value) {
        return done !== void 0 ? done(res) : res;
      }
      accum(res, i++, value);
    }
  },
  as_pair_stream(ctx2, { res, accum, done }) {
    while (true) {
      const key = ctx2.next_value();
      if (cbor_break_sym === key) {
        return done !== void 0 ? done(res) : res;
      }
      accum(res, key, ctx2.next_value());
    }
  },
  as_float16(ctx2) {
    const u8 = ctx2.u8, idx = ctx2.move(2);
    return ctx2.types.float16(u8.subarray(idx, idx + 2));
  },
  as_float32(ctx2) {
    const u8 = ctx2.u8, idx = ctx2.move(4);
    return ctx2.types.float32(u8, idx);
  },
  as_float64(ctx2) {
    const u8 = ctx2.u8, idx = ctx2.move(8);
    return ctx2.types.float64(u8, idx);
  },
  bind_tag_dispatch(tags_lut) {
    if (typeof tags_lut.get !== "function") {
      throw new TypeError("Expected a tags Map");
    }
    return function(ctx2, tag) {
      let tag_handler = tags_lut.get(tag);
      if (!tag_handler) {
        return cbor_tag.from(tag, ctx2.next_value());
      }
      let hdlr = tag_handler(ctx2, tag);
      let body = ctx2.next_value();
      if (!hdlr) {
        return body;
      }
      if (hdlr.custom_tag) {
        return hdlr.custom_tag(ctx2, tag, body);
      }
      return hdlr(body);
    };
  }
};
class CBORDecoderBasic extends CBORDecoderBase {
  static get decode() {
    return new this().decode;
  }
  static get iter_decode() {
    return new this().iter_decode;
  }
  _bind_cbor_jmp(options, jmp) {
    return _cbor_jmp_sync.bind_jmp(options, jmp);
  }
  _bind_u8ctx(types, jmp, unknown) {
    return (this.U8DecodeCtx || U8SyncDecodeCtx).subclass(types, jmp, unknown);
  }
}
CBORDecoderBasic.compile({
  types: decode_types
});
class CBORDecoder extends CBORDecoderBasic {
}
CBORDecoder.compile({
  types: decode_types,
  tags: [true]
});
const { decode, iter_decode } = new CBORDecoder();
async function* _aiter_move_stream(u8_stream) {
  let n = yield;
  let i0 = 0, i1 = n;
  let u8_tail;
  if (u8_stream.subarray) {
    u8_stream = [u8_stream];
  }
  for await (let u8 of u8_stream) {
    u8 = as_u8_buffer(u8);
    if (u8_tail) {
      u8 = u8_concat([u8_tail, u8]);
      u8_tail = void 0;
    }
    while (i1 <= u8.byteLength) {
      n = yield u8.subarray(i0, i1);
      i0 = i1;
      i1 += n;
    }
    u8_tail = i0 >= u8.byteLength ? void 0 : u8.subarray(i0);
    i0 = 0;
    i1 = n;
  }
}
class U8AsyncDecodeCtx extends U8DecodeBaseCtx {
  static bind_decode_api(decoder) {
    decoder.decode_stream = (u8_stream) => this.from_u8_stream(u8_stream, decoder.types).decode_cbor();
    decoder.aiter_decode_stream = (u8_stream) => this.from_u8_stream(u8_stream, decoder.types).aiter_decode_cbor();
  }
  static from_u8(u8, types) {
    return this.from_u8_stream(u8_as_stream(u8), types);
  }
  static get from_u8_stream() {
    const inst0 = new this();
    return (u8_stream, types) => {
      let u8_aiter = _aiter_move_stream(u8_stream);
      u8_aiter.next();
      const inst = {
        __proto__: inst0,
        _apply_overlay: inst0._overlay_noop,
        u8_aiter
      };
      if (types && types !== inst0.types) {
        inst.types = types;
      }
      return inst;
    };
  }
  static bind_next_value(jmp, unknown) {
    if (unknown == null) {
      unknown = this._error_unknown;
    }
    return async function next_value() {
      const doneTypes = this._apply_overlay();
      const [type_b] = await this.move_stream(1, cbor_done_sym);
      const decode2 = jmp[type_b] || unknown;
      const res = await decode2(this, type_b);
      return doneTypes === void 0 ? res : await doneTypes(res);
    };
  }
  async decode_cbor() {
    try {
      return await this.next_value();
    } catch (e) {
      throw cbor_done_sym !== e ? e : new Error(`End of content`);
    }
  }
  async *aiter_decode_cbor() {
    try {
      while (1) {
        yield await this.next_value();
      }
    } catch (e) {
      if (cbor_done_sym !== e) {
        throw e;
      }
    }
  }
  async move_stream(count_bytes, eoc_sym = cbor_eoc_sym) {
    let tip = await this.u8_aiter.next(count_bytes);
    if (tip.done) {
      throw eoc_sym;
    }
    return tip.value;
  }
}
const _cbor_jmp_async = {
  __proto__: _cbor_jmp_base,
  cbor_tiny(as_type) {
    return function w0_as(ctx2, type_b) {
      return as_type(ctx2, type_b & 31);
    };
  },
  cbor_w1(as_type) {
    return async function w1_as(ctx2) {
      const u8 = await ctx2.move_stream(1);
      return as_type(ctx2, u8[0]);
    };
  },
  cbor_w2(as_type) {
    return async function w2_as(ctx2) {
      const u8 = await ctx2.move_stream(2);
      return as_type(ctx2, u8[0] << 8 | u8[1]);
    };
  },
  cbor_w4(as_type) {
    return async function w4_as(ctx2) {
      const u8 = await ctx2.move_stream(4);
      return as_type(ctx2, ctx2.types.u32(u8, 0));
    };
  },
  cbor_w8(as_type) {
    return async function w8_as(ctx2) {
      const u8 = await ctx2.move_stream(8);
      return as_type(ctx2, ctx2.types.u64(u8, 0));
    };
  },
  async as_bytes(ctx2, len) {
    const u8 = await ctx2.move_stream(len);
    return ctx2.types.bytes(u8.subarray(0, len));
  },
  async as_utf8(ctx2, len) {
    const u8 = await ctx2.move_stream(len);
    return ctx2.types.utf8(u8.subarray(0, len));
  },
  async as_list(ctx2, len) {
    const { res, accum, done } = ctx2.types.list(len);
    for (let i = 0; i < len; i++) {
      accum(res, i, await ctx2.next_value());
    }
    return done !== void 0 ? done(res) : res;
  },
  async as_map(ctx2, len) {
    const { res, accum, done } = ctx2.types.map(len);
    for (let i = 0; i < len; i++) {
      const key = await ctx2.next_value();
      const value = await ctx2.next_value();
      accum(res, key, value);
    }
    return done !== void 0 ? done(res) : res;
  },
  async as_stream(ctx2, { res, accum, done }) {
    let i = 0;
    while (true) {
      const value = await ctx2.next_value();
      if (cbor_break_sym === value) {
        return done !== void 0 ? done(res) : res;
      }
      accum(res, i++, value);
    }
  },
  async as_pair_stream(ctx2, { res, accum, done }) {
    while (true) {
      const key = await ctx2.next_value();
      if (cbor_break_sym === key) {
        return done !== void 0 ? done(res) : res;
      }
      accum(res, key, await ctx2.next_value());
    }
  },
  async as_float16(ctx2) {
    return ctx2.types.float16(await ctx2.move_stream(2));
  },
  async as_float32(ctx2) {
    return ctx2.types.float32(await ctx2.move_stream(4));
  },
  async as_float64(ctx2) {
    return ctx2.types.float64(await ctx2.move_stream(8));
  },
  bind_tag_dispatch(tags_lut) {
    if (typeof tags_lut.get !== "function") {
      throw new TypeError("Expected a tags Map");
    }
    return async function as_tag(ctx2, tag) {
      let tag_handler = tags_lut.get(tag);
      if (!tag_handler) {
        return cbor_tag.from(tag, await ctx2.next_value());
      }
      let hdlr = await tag_handler(ctx2, tag);
      let body = await ctx2.next_value();
      if (!hdlr) {
        return body;
      }
      if (hdlr.custom_tag) {
        return hdlr.custom_tag(ctx2, tag, body);
      }
      return hdlr(body);
    };
  }
};
class CBORAsyncDecoderBasic extends CBORDecoderBase {
  static get decode_stream() {
    return new this().decode_stream;
  }
  static get aiter_decode_stream() {
    return new this().aiter_decode_stream;
  }
  _bind_cbor_jmp(options, jmp) {
    return _cbor_jmp_async.bind_jmp(options, jmp);
  }
  _bind_u8ctx(types, jmp, unknown) {
    return (this.U8DecodeCtx || U8AsyncDecodeCtx).subclass(types, jmp, unknown);
  }
}
CBORAsyncDecoderBasic.compile({
  types: decode_types
});
class CBORAsyncDecoder extends CBORAsyncDecoderBasic {
}
CBORAsyncDecoder.compile({
  types: decode_types,
  tags: [true]
});
new CBORAsyncDecoder();
export { decode as d, iter_decode as i };
