import WelcomePage from "@/app/(student_space)/requestPnd";
import { View , StyleSheet} from "react-native";

export default function req(){
    return(
        <View style={styles.container}>
          <WelcomePage/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"white"
    }
})