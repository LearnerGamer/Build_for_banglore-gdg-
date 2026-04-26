import { StyleSheet, View, ScrollView } from 'react-native';
import { Shield, Zap, Droplets, PhoneCall, AlertTriangle, Info, Wind, Thermometer } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function GuidelinesScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Safety Guidelines</ThemedText>
        <ThemedText style={styles.subtitle}>Essential actions for emergency situations.</ThemedText>
      </ThemedView>

      <View style={styles.section}>
        <TextHeader icon={<Shield color="#34c759" size={20} />} title="Immediate Actions" />
        <GuidelineCard 
          icon={<Zap color="#ffcc00" size={24} />} 
          title="Power & Energy" 
          desc="Turn off main electrical switches if flooding is imminent. Unplug all electronics."
        />
        <GuidelineCard 
          icon={<Droplets color="#007aff" size={24} />} 
          title="Water Safety" 
          desc="Store at least 3 liters of water per person. Avoid contact with flood water."
        />
      </View>

      <View style={styles.section}>
        <TextHeader icon={<AlertTriangle color="#ff3b30" size={20} />} title="Evacuation Prep" />
        <GuidelineCard 
          icon={<Wind color="#a0a8b5" size={24} />} 
          title="Go-Bag" 
          desc="Keep a bag with documents, medicine, flashlight, and dry food ready at all times."
        />
        <GuidelineCard 
          icon={<Thermometer color="#ff9500" size={24} />} 
          title="Medical" 
          desc="Note down blood groups and keep an emergency first-aid kit accessible."
        />
      </View>

      <View style={styles.footer}>
        <PhoneCall color="#34c759" size={24} />
        <ThemedText style={styles.footerText}>Emergency Helpline: 112</ThemedText>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const TextHeader = ({ icon, title }: any) => (
  <View style={styles.textHeader}>
    {icon}
    <ThemedText style={styles.sectionLabel}>{title}</ThemedText>
  </View>
);

const GuidelineCard = ({ icon, title, desc }: any) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>{icon}</View>
    <View style={styles.cardContent}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDesc}>{desc}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { marginTop: 60, marginBottom: 30, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: '900', color: 'white' },
  subtitle: { color: '#8b949e', marginTop: 8 },
  section: { marginBottom: 30 },
  textHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionLabel: { color: '#8b949e', fontWeight: '800', letterSpacing: 1, fontSize: 12, textTransform: 'uppercase' },
  card: {
    flexDirection: 'row', backgroundColor: '#1c1c1e', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { color: 'white', fontWeight: '800', fontSize: 16, marginBottom: 4 },
  cardDesc: { color: '#8b949e', fontSize: 13, lineHeight: 18 },
  footer: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, 
    padding: 24, backgroundColor: 'rgba(52,199,89,0.1)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(52,199,89,0.2)'
  },
  footerText: { color: '#34c759', fontWeight: '900', fontSize: 18 }
});
