export function obfuscate(value: string) {
  const bytes = [];

  for (let i = 0; i < value.length; i++) {
    let charCode = value.charCodeAt(i).toString();
    charCode = String(`000${charCode}`).slice(-3);
    bytes.push(charCode);
  }

  return bytes.join('');
}

export function deobfuscate(value: string) {
  let str = '';
  const chunks = value.match(/.{1,3}/g) || [];

  for (let i = 0; i < chunks.length; i++) {
    str += String.fromCharCode(parseInt(chunks[i], 10));
  }

  return str;
}
