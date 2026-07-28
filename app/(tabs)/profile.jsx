import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color="#0B2554" />
        </TouchableOpacity>
        <View style={styles.brand}>
          <Image source={require('../../assets/images/splash-icon.png')} style={styles.logo} />
          <Text style={styles.brandText}>
            Trust<Text style={styles.brandAccent}>Lend</Text>
          </Text>
        </View>
        <FontAwesome name="user-circle" size={36} color="#0B2554" />
      </View>

      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Owner Profile</Text>
      </View>

      <View style={styles.profileRow}>
        <FontAwesome name="user-circle" size={50} color="#0B2554" />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>Jane Smith</Text>
      
        </View>

        <TouchableOpacity style={[styles.editButton,{marginTop:-35}]}>
          <Ionicons name="pencil" size={14} color="#FFFFFF" />
          <Text style={[styles.editText,]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.detailsList,{marginLeft:55}]}>
            <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.verifiedText}>Verified Renter</Text>
          </View>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={18} color="#5A5A72" />
          <Text style={styles.detailText}>jane.smith@email.com</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={18} color="#5A5A72" />
          <Text style={styles.detailText}>+2348012345678</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#5A5A72" />
          <Text style={styles.detailText}>Lagos, Nigeria</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color="#5A5A72" />
          <Text style={styles.detailText}>Joined on Jan 10, 2025</Text>
        </View>
      </View>

      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Business Information</Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.greyCard]}>
          <Text style={styles.cardLabel}>Business Name</Text>
          <Text style={styles.cardValue}>Smith Equipment Rentals</Text>

          <Text style={[styles.cardLabel, styles.spacedLabel]}>Business Type</Text>
          <Text style={styles.cardValue}>Equipment Rental Service</Text>

          <Text style={[styles.cardLabel, styles.spacedLabel]}>Years in Business</Text>
          <Text style={styles.cardValue}>3+ Years</Text>
        </View>

        <View style={[styles.card, styles.orangeCard]}>
          <Text style={styles.cardLabelLight}>Business Address</Text>
          <Text style={styles.cardValueLight}>12 Adekunle Street, Surulere, Lagos, Nigeria</Text>

          <Text style={[styles.cardLabelLight, styles.spacedLabel]}>CAC Number</Text>
          <Text style={styles.cardValueLight}>RC1234567</Text>

          <Text style={[styles.cardLabelLight, styles.spacedLabel]}>Tax Identification Number</Text>
          <Text style={styles.cardValueLight}>12345678901</Text>
        </View>
      </View>

      <View style={[styles.cardsRow,{width:290}]}>
        <View style={[styles.card, styles.blueCard]}>
          <Text style={styles.cardLabelLight}>Bank Details</Text>

          <Text style={[styles.cardLabelLight, styles.spacedLabel]}>Bank Name</Text>
          <Text style={styles.cardValueLight}>GTBank Plc</Text>

          <Text style={[styles.cardLabelLight, styles.spacedLabel]}>Account Number</Text>
          <Text style={styles.cardValueLight}>012345689</Text>
        </View>

        <View style={[styles.card, styles.greyCard,]}>
          <Text style={styles.cardLabel}>Account Name</Text>
          <Text style={styles.cardValue}>Jane Smith</Text>

          <Text style={[styles.cardLabel, styles.spacedLabel]}>Swift Code</Text>
          <Text style={styles.cardValue}>GTBINGLA</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B2554',
  },
  brandAccent: {
    color: '#E8A325',
  },
  titleBar: {
    backgroundColor: '#0B2554',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2554',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2554',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2554',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsList: {
    marginBottom: 24,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#3A3A55',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
  },
  greyCard: {
    backgroundColor: '#E5E7EB',
  },
  orangeCard: {
    backgroundColor: '#E8A325',
  },
  blueCard: {
    backgroundColor: '#0B2554',
  },
  bankExtra: {
    flex: 1,
    paddingVertical: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5A72',
  },
  cardLabelLight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardValue: {
    fontSize: 14,
    color: '#1A1A2E',
    marginTop: 4,
  },
  cardValueLight: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  spacedLabel: {
    marginTop: 16,
  },
});