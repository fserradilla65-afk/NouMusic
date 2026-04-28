import { ui$, updateUrl } from '@/states/ui'
import { onReceiveAuthUrl } from './supabase/auth'
import { settings$ } from '@/states/settings'
import { debounce } from 'es-toolkit'

export { getPageType } from './page-type'

export function fixPageTitle(title: string) {
  return title.replace(/ - YouTube( Music)*$/, '')
}

export function fixSharingUrl(v: string) {
  try {
    const url = new URL(v)
    url.searchParams.delete('pp')
    return url.href
  } catch {
    return ''
  }
}

export function getVideoThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/* https://www.youtube.com/watch?v=<id> */
export function getVideoId(url: string) {
  try {
    return new URL(url).searchParams.get('v')
  } catch {
    return ''
  }
}

export function getThumbnail(url: string) {
  const id = getVideoId(url)
  return id ? getVideoThumbnail(id) : undefined
}

export function openSharedUrl(url: string) {
  if (url.startsWith('noumusic:auth')) {
    onReceiveAuthUrl(url)
    return
  }
  try {
    const fixedUrl = fixSharingUrl(url)
    const parsed = new URL(fixedUrl)
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(parsed.host)) {
      parsed.host = 'music.youtube.com'
      updateUrl(parsed.href)
      return
    }
    if (parsed.host === 'music.youtube.com') {
      updateUrl(fixedUrl.replace('noumusic://', 'https://'))
    }
  } catch (error) {
    console.error(error)
  }
}

export const setPageUrl = debounce(async function (url: string) {
  if (!url) {
    return
  }
  ui$.pageUrl.set(url)
}, 300)
