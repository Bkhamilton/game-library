import { StyleSheet, Dimensions } from 'react-native';
import { View } from '@/components/Themed';
import ProfilePage from '@/components/ProfilePage/ProfilePage';

export default function TabTwoScreen() {
  return (
      <View style={styles.container}>
        <ProfilePage />
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
});
