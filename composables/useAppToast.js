export const useAppToast = () => {
    const toast = useToast()

    return {
        toastSuccess: ({ title, descrption = null }) => {
            toast.add({
                title: title,
                descrption: descrption,
                icon: "i-heroicons-check-circle",
                color: "green",
            });
        },
        toastError: ({ title, descrption = null }) => {
            toast.add({
                title: title,
                descrption: descrption,
                icon: "i-heroicons-exclamation-circle",
                color: "red",
            })
        }
    }
}