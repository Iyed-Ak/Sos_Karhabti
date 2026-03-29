import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import AddVehicleScreen from '../../../src/screens/Vehicle/AddVehicleScreen';

export default function AddVehicleRoute() {
  const { vehicleId } = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ title: vehicleId ? 'Modifier véhicule' : 'Ajouter un véhicule' }} />
      <AddVehicleScreen />
    </>
  );
}
