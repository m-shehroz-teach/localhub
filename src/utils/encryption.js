// End-to-End Encryption using Web Crypto API AES-GCM

async function getEncryptionKey(roomKey) {
  const enc = new TextEncoder();
  const rawKey = enc.encode(roomKey);
  const hash = await crypto.subtle.digest('SHA-256', rawKey);
  return await crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(text, roomKey) {
  try {
    const key = await getEncryptionKey(roomKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    );
    return {
      iv: btoa(String.fromCharCode(...iv)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  } catch (err) {
    console.error('Text encryption failed:', err);
    throw err;
  }
}

export async function decryptText(encryptedObj, roomKey) {
  try {
    const key = await getEncryptionKey(roomKey);
    const iv = new Uint8Array(atob(encryptedObj.iv).split('').map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(atob(encryptedObj.ciphertext).split('').map(c => c.charCodeAt(0)));
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.error('Text decryption failed:', err);
    throw err;
  }
}

export async function encryptFileBuffer(arrayBuffer, roomKey) {
  try {
    const key = await getEncryptionKey(roomKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      arrayBuffer
    );
    
    // Combine IV + ciphertext into a single packet
    const result = new Uint8Array(iv.length + ciphertext.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(ciphertext), iv.length);
    return result.buffer;
  } catch (err) {
    console.error('File encryption failed:', err);
    throw err;
  }
}

export async function decryptFileBuffer(combinedBuffer, roomKey) {
  try {
    const key = await getEncryptionKey(roomKey);
    const combined = new Uint8Array(combinedBuffer);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    return await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
  } catch (err) {
    console.error('File decryption failed:', err);
    throw err;
  }
}
