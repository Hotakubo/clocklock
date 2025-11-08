export const urlToDomain = ({ url }: { url: string }) => {
  try {
    return new URL(url).hostname
  } catch (e) {
    return ''
  }
}
