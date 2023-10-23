import React from 'react';
import { HStack, StatusBar, VStack, Input, Icon } from 'native-base';
import { StyleSheet, View, Dimensions, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../../theme/colors';


const w = Dimensions.get('screen').width;

const Header = (props) => {
    const navigation = useNavigation()

    if (props.route.name == 'SubCategory' || props.route.name == 'ProductsList' ||
        props.route.name == 'Comments' || props.route.name == 'Cart'
    ) {
        return (
            <>
                <HStack bg={colors.header} justifyContent="space-between" alignItems="center" w="100%" h="85" >
                    <View style={styles.subHeader}>
                        <Ripple onPress={() => navigation.goBack()}>
                            <MIcon name="arrow-forward" size={30} color="#fff" />
                        </Ripple>
                        <Text style={styles.title}>{props.route.params.title}</Text>
                    </View>
                </HStack >
            </>
        )
    } else {
        return (
            <>
                <StatusBar bg={colors.header} barStyle="light-content" />
                <HStack bg={colors.header} justifyContent="space-between" alignItems="center" w="100%" h="85" >
                    <View style={styles.container}>
                        <Ripple
                            onPress={() => navigation.openDrawer()}
                        >
                            <MCIcon name="menu" size={30} color="#fff" />
                        </Ripple>

                        <View style={styles.search}>
                            <Pressable>
                                <VStack w="100%" height={35} space={5} alignSelf="center"  >
                                    <Input placeholder="جستجو" height={35} width="100%" borderRadius="4" borderColor="#fff" py="1" px="2" fontSize="12"
                                        InputLeftElement={<Icon m="2" ml="3" size="8" color="gray.400" as={<MIcon name="search" />} />}
                                        InputRightElement={<Icon m="2" mr="3" size="8" color="gray.400" as={<MIcon name="mic" />} />} />
                                </VStack>
                            </Pressable>
                        </View>

                        <Ripple onPress={() => navigation.navigate('Cart', { title: 'سبد خرید' })}>
                            <MCIcon name="cart" size={30} color="#fff" />
                        </Ripple>
                    </View>
                </HStack>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors.header,
        paddingHorizontal: 10,
    },
    search: {
        flex: 1,
        width: w / 2,
        marginTop: -3,
        marginHorizontal: 15,
        backgroundColor: '#fff'
    },
    subHeader: {
        flex: 1,
        flexDirection: 'row-reverse',
        width: '100%',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        marginRight: 20
    }
})
export default React.memo(Header)