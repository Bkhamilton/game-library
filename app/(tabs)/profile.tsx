import { StyleSheet, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.image}> 
          <FontAwesome name="image" size={48} color="black" />
        </View>
      
      </View>

        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginHorizontal: '45%'
  }
});
