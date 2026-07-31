import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  balanceBg: '#0B2554',
  subCardBg: '#294069',
  screenBg: '#F5F6F8',
  cardBg: '#FFFFFF',
  textDark: '#1A1A2E',
  textMuted: '#8A8FA3',
  green: '#1E9E5A',
  red: '#D64545',
  orange: '#D68F00',
};

export default function WalletScreen() {
  const router = useRouter();

  const activeRentals = [
    {
      id: '1',
      name: 'Canon EOS R50',
      amount: '₦20,000',
      daysLeft: '3 days left',
      renter: 'Peace D.',
      image: null, // TODO: add image path
    },
    {
      id: '2',
      name: 'DJI Mini Drone',
      amount: '₦85,000',
      daysLeft: '1 day left',
      renter: 'Ama K.',
      image: null, // TODO: add image path
    },
  ];

  const transactions = [
    {
      id: '1',
      title: 'Payment received...',
      date: '23 Jul 2026, 10:35 AM',
      amount: '₦20,000',
      status: 'Completed',
      type: 'in',
    },
    {
      id: '2',
      title: 'Withdrawal to GTB...',
      date: '22 Jul 2026, 02:18 PM',
      amount: '-₦65,000',
      status: 'Completed',
      type: 'out',
    },
    {
      id: '3',
      title: 'Payment received...',
      date: '21 Jul 2026, 11:42 AM',
      amount: '₦85,000',
      status: 'Completed',
      type: 'in',
    },
    {
      id: '4',
      title: 'Payout processing...',
      date: '23 Jul 2026, 8:35 PM',
      amount: '-₦20,000',
      status: 'Processing',
      type: 'out',
    },
  ];

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            ₦65,079<Text style={styles.balanceDecimal}>.24</Text>
          </Text>
        </View>

        <View style={styles.subCardRow}>
          <View style={styles.subCard}>
            <Text style={styles.subCardLabel}>Pending</Text>
            <Text style={styles.subCardValue}>₦45,000</Text>
          </View>
          <View style={styles.subCard}>
            <Text style={styles.subCardLabel}>Earned (30d)</Text>
            <Text style={styles.subCardValue}>₦250,000</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <Ionicons name="arrow-down-circle-outline" size={26} color="#0B2554" />
          <Text style={styles.actionLabel}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={26} color="#0B2554" />
          <Text style={styles.actionLabel}>Add Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <Ionicons name="time-outline" size={26} color="#0B2554" />
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Active Rentals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTIVE RENTALS</Text>
        <View style={styles.card}>
          {activeRentals.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.rentalRow,
                index !== activeRentals.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.rentalThumb}>
                {item.image ? (
                  <Image source={item.image} style={styles.rentalImage} />
                ) : (
                  <Ionicons name="image-outline" size={22} color={COLORS.textMuted} />
                )}
              </View>
              <View style={styles.rentalInfo}>
                <Text style={styles.rentalName}>{item.name}</Text>
                <Text style={styles.rentalMeta}>{item.daysLeft}</Text>
              </View>
              <View style={styles.rentalAmountBox}>
                <Text style={styles.rentalAmount}>{item.amount}</Text>
                <Text style={styles.rentalRenter}>{item.renter}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
        <View style={styles.card}>
          {transactions.map((tx, index) => (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                index !== transactions.length - 1 && styles.rowDivider,
              ]}
            >
              <View
                style={[
                  styles.txIconBox,
                  { backgroundColor: tx.type === 'in' ? '#E3F6EA' : '#E7EEFB' },
                ]}
              >
                <Ionicons
                  name={tx.type === 'in' ? 'arrow-down' : 'arrow-up'}
                  size={16}
                  color={tx.type === 'in' ? COLORS.green : '#3D5A99'}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <View style={styles.txAmountBox}>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.amount.startsWith('-') ? COLORS.textDark : COLORS.green },
                  ]}
                >
                  {tx.amount}
                </Text>
                <Text
                  style={[
                    styles.txStatus,
                    { color: tx.status === 'Completed' ? COLORS.green : COLORS.orange },
                  ]}
                >
                  {tx.status}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all transactions →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payout Accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PAYOUT ACCOUNTS</Text>
        <View style={styles.card}>
          <View style={styles.bankRow}>
            <View style={styles.bankLogo}>
              <Text style={styles.bankLogoText}>GTB</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>GT Bank</Text>
              <Text style={styles.bankAccount}>•••• 4231</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Withdraw Funds Button */}
      <TouchableOpacity style={styles.withdrawButton} activeOpacity={0.85}>
        <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F7FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.balanceBg,
    borderRadius: 18,
    padding: 20,
  },
  balanceLabel: {
    color: '#C7CFE2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 6,
    marginBottom: 18,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  balanceDecimal: {
    fontSize: 18,
    fontWeight: '500',
    color: '#C7CFE2',
  },
  subCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    backgroundColor: COLORS.subCardBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  subCardLabel: {
    color: '#AEB7CF',
    fontSize: 12,
    marginBottom: 4,
  },
  subCardValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth:1 ,
    borderColor:'#9A9C9F',
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
    
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
    
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingHorizontal: 14,
       borderWidth:1 ,
    borderColor:'#9A9C9F',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  rentalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    
  },
  rentalThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F0F2F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    
  },
  rentalImage: {
    width: '100%',
    height: '100%',
  },
  rentalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rentalName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  rentalMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rentalAmountBox: {
    alignItems: 'flex-end',
  },
  rentalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  rentalRenter: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  txIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  txDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  txAmountBox: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  txStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  viewAll: {
    textAlign: 'center',
    color: COLORS.balanceBg,
    fontWeight: '600',
    fontSize: 13,
    paddingVertical: 14,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E8492A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bankInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  bankAccount: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  editLink: {
    color: COLORS.balanceBg,
    fontWeight: '600',
    fontSize: 13,
  },
  withdrawButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.balanceBg,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
