// This function does not always work!!
export async function scanDir(
  path: string,
  filename: string,
): Promise<Uint8Array> {
  const concatDirAndFile = path + "/" + filename;
  try {
    const dir = await Deno.lstat(concatDirAndFile);
    if (dir.isFile) {
      return Deno.readFile(concatDirAndFile) as unknown as Uint8Array;
    }
  } catch (_error) {
    for await (const entry of Deno.readDir(path)) {
      if (entry.isDirectory) {
        return scanDir(path + "/" + entry.name, filename);
      }
    }

    return new TextEncoder().encode("Not Found: " + filename);
  }

  return new Uint8Array();
}
