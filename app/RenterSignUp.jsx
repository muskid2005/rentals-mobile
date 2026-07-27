import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
export default function RenterSignUp() {

   const [role, setRole] = useState('renter');
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = () => {
    if (!agreed) {
      alert('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }
    console.log({ role, fullName, email, phone, password });
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#F2F7FF'}}>
    <View
      style={{marginTop:10,
        flex: 1,flexDirection:'row',
        justifyContent: "center",
    alignContent:'center'
      }}
      
    >
      <Image style={{width:40,height:40}}
        source={require('../assets/images/Logo.png.png')}>
              
      </Image>
         
        <Text style={{marginLeft:10,color:'#0B2554',height:28,marginTop:10,fontSize:18
                
                }}>Trust{''} 
                      <Text style={{color:'#E8A325'
                
         }}>Lend</Text></Text>
      



      
    </View>
     <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: role === 'renter' ? '#0B2554' : '#F0F0F0' },
          ]}
          onPress={() => setRole('renter')}
        >
          <Text
            style={[
              styles.toggleText,
              { color: role === 'renter' ? '#FFFFFF' : '#0B2554' },
            ]}
          >
            I'm a Renter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: role === 'owner' ? '#0B2554' : '#F0F0F0' },
          ]}
          onPress={() => setRole('owner')}
        >
          <Text
            style={[
              styles.toggleText,
              { color: role === 'owner' ? '#FFFFFF' : '#0B2554' },
            ]}
          >
            I'm an Owner
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#C4CDDD"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#C4CDDD"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#C4CDDD"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#C4CDDD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#C4CDDD"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            agreed && { backgroundColor: '#E8A325', borderColor: '#E8A325' },
          ]}
          onPress={() => setAgreed(!agreed)}
        >
          {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsHighlight}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
        <Text style={styles.createButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginRow}
        onPress={() => navigation?.navigate('Login')}
      >
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginHighlight}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );


    </SafeAreaView>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
   marginBottom:300,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    width: 344,
    height: 35,
    backgroundColor: '#FCFDFF',
    borderRadius: 16,
    paddingLeft: 12,
    paddingTop: 8,
    marginBottom: 14,
    fontSize: 14,
    color: '#0B2554',
    borderWidth: 1,
    borderColor: '#E5E9F2',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 344,
    marginTop: 6,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C4CDDD',
    marginRight: 8,
    marginLeft:8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#0B2554',
  },
  termsHighlight: {
    color: '#E8A325',
    fontWeight: '600',
  },
  createButton: {
    width: 335,
    height: 48,
    backgroundColor: '#0B2554',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  loginRow: {
    alignItems: 'center',
  },
  loginText: {
    color: '#0B2554',
    fontSize: 13,
  },
  loginHighlight: {
    color: '#E8A325',
    fontWeight: '600',
  },
});
