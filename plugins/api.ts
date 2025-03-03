export default defineNuxtPlugin(() => {
	const toast = useToast()
	const {apiUrl} = useRuntimeConfig().public

	const api = $fetch.create({
		baseURL: apiUrl,
		onResponseError({response}){
			console.log(response);
			toast.add({
				title: response._data.message,
				color: 'error'
			})
		}
	})

	return {provide: {api}}
})
