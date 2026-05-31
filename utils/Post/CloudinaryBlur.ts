export function getCloudinaryBlur(url: string) {
  return url.replace(
    '/upload/',
    '/upload/w_20,q_10,e_blur:1000/'
  )
}
