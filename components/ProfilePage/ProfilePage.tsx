import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';


export default function ProfilePage() {

    return (
        <View style={styles.container}>
            <View style={styles.card}>
            
            <View style={styles.image}> 
                <FontAwesome name="image" size={80} />
            </View>

            <View>
                <Text style={styles.username}>Username or First/Last</Text>
            </View>

            <View style={styles.friends}>
                <Text> Friends </Text>
                <Text> 3</Text>
            </View>

            <View style={styles.stats}>
                <View style={styles.statBox}>
                    <Text>Sudoku</Text>
                    <Text>Wins</Text>
                    <Text>0</Text>
            </View>

            <View style={styles.statBox}>
                <Text>Dino Run</Text>
                <Text>Wins</Text>
                <Text>0</Text>
            </View>

            <View style={styles.statBox}>
                <Text>Word Search</Text>
                <Text>Wins</Text>
                <Text>0</Text>
            </View>

        </View>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      card: {
        borderWidth: 1,
        borderRadius: 40,
        shadowColor: 'black',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.8,
        width: '85%',  // 50% of screen width
        height: '80%' // 50% of screen height
      },
      image: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '35%',
        borderWidth: 4,
        borderRadius: 40,
        borderColor: 'red',
        padding: 8,
        marginTop: '15%',
      },
      username: { 
        fontSize: 24,
        textAlign: 'center',
        marginTop: '10%',  
      },
      friends: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
      },
      stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '10%',
        width: '100%',
      },
      statBox: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'black',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center',
      }
});