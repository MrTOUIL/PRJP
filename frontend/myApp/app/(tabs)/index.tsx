import WelcomePage from "@/app/(welcome page)/welcomePage";
import { View , StyleSheet} from "react-native";

export default function welcomepage(){
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