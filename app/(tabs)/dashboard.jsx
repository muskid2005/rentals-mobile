import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function dashboard() {
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      <AntDesign name="user" size={24} color="black" style={styles.avatar}/>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.darkCard,{backgroundColor:'#0B2554'}]}>
          <Text style={styles.statLabelDark}>Active Rentals</Text>
          <Text style={[styles.statValueDark,{color:'#FFFF'}]}>03</Text>
          <Text style={styles.statSubDark}>Items out right now</Text>
        </View>

        <View style={[styles.statCard, styles.lightCard]}>
          <Text style={styles.statLabel}>Active Listings</Text>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statSub}>2 awaiting your response</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.orangeCard]}>
          <Text style={styles.statLabelDark}>Total Earnings</Text>
          <Text style={styles.statValueDark}>550,000</Text>
          <Text style={styles.statSubDark}>NGN · all listings</Text>
        </View>

        <View style={[styles.statCard, styles.lightCard]}>
          <View style={styles.bookingsHeader}>
            <Text style={styles.statLabel}>Bookings</Text>
            <TouchableOpacity>
              <Text style={[styles.link,{fontSize:8}]}>Booking History &gt;</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statValue}>36</Text>
          <Text style={styles.statSub}>Releasing in 2 days</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PENDING BOOKING REQUESTS</Text>
          <TouchableOpacity>
            <Text style={styles.link}>View all &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestRow}>
          <Image source={require('../../assets/images/Cannon.png')} style={styles.itemImage} />
          <View style={styles.requestInfo}>
            <Text style={styles.itemName}>Canon EOS R50</Text>
            <Text style={styles.requestSub}>Requested by Mary O.</Text>
            <Text style={styles.requestDates}>Jul 26 - Jul 29 · 3 days</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.link,{marginLeft:40}]}>View details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE RENTALS</Text>
          <TouchableOpacity>
            <Text style={styles.link}>View all &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rentalRow}>
          <Image source={require('../../assets/images/Sony.png')} style={styles.itemImage} />
          <View style={styles.requestInfo}>
            <Text style={styles.itemName}>Sony FX3</Text>
            <Text style={styles.requestSub}>Renter: Esa M.</Text>
          </View>
          <Text style={styles.returnDate}>Returns Jul 25</Text>
        </View>

        <View style={styles.rentalRow}>
          <Image source={require('../../assets/images/Nikkon.png')} style={styles.itemImage} />
          <View style={styles.requestInfo}>
            <Text style={styles.itemName}>Nikon Z30</Text>
            <Text style={styles.requestSub}>Renter: Tobi A.</Text>
          </View>
          <Text style={styles.returnDate}>Returns Jul 27</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UPCOMING PICKUPS & RETURNS</Text>
          <TouchableOpacity>
            <Text style={styles.link}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7FF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginLeft:-150
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop:10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  darkCard: {
    backgroundColor: '#0B2554',
  },
  lightCard: {
    backgroundColor: '#DCE6F7',
  },
  orangeCard: {
    backgroundColor: '#F2994A',
  },
  statLabel: {
    fontSize: 13,
    color: '#3A3A55',
    fontWeight: '600',
  },
  statLabelDark: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
    marginVertical: 4,
  },
  statValueDark: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B2554',
    marginVertical: 4,
  },
  statSub: {
    fontSize: 12,
    color: '#6E6E85',
  },
  statSubDark: {
    fontSize: 12,
    color: '#D0D0E0',
  },
  bookingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 12,
    color: '#5B7FDE',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rentalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#EEE',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  requestSub: {
    fontSize: 12,
    color: '#8A8AA0',
    marginTop: 2,
  },
  requestDates: {
    fontSize: 12,
    color: '#8A8AA0',
    marginTop: 2,
  },
  returnDate: {
    fontSize: 12,
    color: '#8A8AA0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  acceptButton: {
    backgroundColor:  '#0B2554',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  declineButton: {
    borderWidth: 1,
    borderColor: '#D0D0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  declineText: {
    color: '#8A8AA0',
    fontWeight: '600',
    fontSize: 13,
  },
});
