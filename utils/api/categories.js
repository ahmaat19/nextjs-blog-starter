import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/categories'

const queryKey = 'categories'

export default function useCategoriesHook(props) {
  const { page = 1, id, q = '', limit = 25 } = props
  const queryClient = useQueryClient()

  const getCategories = useQuery(
    queryKey,
    async () =>
      await dynamicAPI('get', `${url}?page=${page}&q=${q}&limit=${limit}`, {}),
    { retry: 0 }
  )

  const updateCategory = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const deleteCategory = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const categoryCategory = useMutation(
    async (obj) => await dynamicAPI('category', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return {
    getCategories,
    updateCategory,
    deleteCategory,
    categoryCategory,
  }
}
