/** A browser illustration of Citadel's fixed-size C wire format. */
(function (root) {
  "use strict";

  const encoder = new TextEncoder();

  function checksum(bytes) {
    return bytes.slice(0, 318).reduce((sum, value) => (sum + value) & 0xffff, 0);
  }

  function serialize({ type, origin, destination, payload }) {
    const bytes = new Uint8Array(320);
    const originBytes = encoder.encode(origin);
    const destinationBytes = encoder.encode(destination);
    const data = encoder.encode(payload);
    if (originBytes.length >= 20 || destinationBytes.length >= 20) {
      throw new Error("Origin and destination must each fit within 19 UTF-8 bytes.");
    }
    if (data.length > 275) throw new Error("The payload exceeds the 275-byte field.");
    bytes[0] = type;
    bytes.set(originBytes, 1);
    bytes.set(destinationBytes, 21);
    new DataView(bytes.buffer).setUint16(41, data.length, false);
    bytes.set(data, 43);
    new DataView(bytes.buffer).setUint16(318, checksum(bytes), false);
    return bytes;
  }

  function inspect(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const length = view.getUint16(41, false);
    const stored = view.getUint16(318, false);
    const computed = checksum(bytes);
    return { length, stored, computed, valid: stored === computed && length <= 275 };
  }

  const api = { serialize, inspect, checksum };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CitadelProtocol = api;
  if (typeof document === "undefined") return;

  const form = document.getElementById("protocol-form");
  if (!form) return;
  const type = document.getElementById("packet-type");
  const destination = document.getElementById("packet-destination");
  const payload = document.getElementById("packet-payload");
  const corrupt = document.getElementById("packet-corrupt");
  const state = document.getElementById("packet-state");
  const presets = { 17: "Stark", 3: "ACCEPT&Stark", 22: "OK&Stark" };

  function update() {
    try {
      const bytes = serialize({
        type: Number(type.value),
        origin: "127.0.0.1:18890",
        destination: destination.value,
        payload: payload.value,
      });
      if (corrupt.checked) bytes[43] ^= 1;
      const result = inspect(bytes);
      document.getElementById("packet-length").textContent = result.length + " / 275 bytes";
      document.getElementById("packet-checksum").textContent =
        "0x" + result.stored.toString(16).padStart(4, "0").toUpperCase();
      document.getElementById("packet-computed").textContent =
        "0x" + result.computed.toString(16).padStart(4, "0").toUpperCase();
      state.textContent = result.valid
        ? "Accepted · length and checksum match"
        : "Rejected · checksum mismatch";
      state.dataset.valid = String(result.valid);
      const hex = [];
      for (let offset = 0; offset < bytes.length; offset += 16) {
        hex.push(
          offset.toString(16).padStart(3, "0").toUpperCase() +
            "  " +
            Array.from(bytes.slice(offset, offset + 16), (byte) =>
              byte.toString(16).padStart(2, "0").toUpperCase(),
            ).join(" "),
        );
      }
      document.getElementById("packet-hex").textContent = hex.join("\n");
    } catch (error) {
      state.textContent = error.message;
      state.dataset.valid = "false";
      document.getElementById("packet-length").textContent =
        encoder.encode(payload.value).length + " / 275 bytes";
      document.getElementById("packet-checksum").textContent = "—";
      document.getElementById("packet-computed").textContent = "—";
      document.getElementById("packet-hex").textContent =
        "Adjust the input to generate a valid frame.";
    }
  }

  type.addEventListener("change", () => {
    payload.value = presets[type.value];
    corrupt.checked = false;
    update();
  });
  form.addEventListener("input", update);
  form.addEventListener("submit", (event) => event.preventDefault());
  update();
})(typeof window !== "undefined" ? window : globalThis);
