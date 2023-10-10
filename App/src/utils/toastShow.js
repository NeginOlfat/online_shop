import { Toast, Box } from 'native-base';

export const showToast = (text) => {
    Toast.show({
        render: () => {
            return <Box bg={'rgba(0, 0, 0, 0.5)'} px="3" py="3" rounded="2xl" mb={8}
                _text={{
                    fontSize: "md",
                    fontWeight: "bold",
                    color: "white"
                }}
            >
                {text}
            </Box>;
        }
    })
};