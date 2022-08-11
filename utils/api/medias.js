import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/media-libraries'

const queryKey = 'medias'

export default function useMediasHook(props) {
  const { page = 1, id, q = '', limit = 25 } = props
  const queryClient = useQueryClient()

  const getMedias = useQuery(
    queryKey,
    async () =>
      await dynamicAPI('get', `${url}?page=${page}&q=${q}&limit=${limit}`, {}),
    { retry: 0 }
  )

  const deleteMedia = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const mediaMedia = useMutation(
    async (obj) => await dynamicAPI('media', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return {
    getMedias,
    deleteMedia,
    mediaMedia,
  }
}
