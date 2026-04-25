import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, Platform, TouchableOpacity, Modal, TextInput } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Shield, Zap, Droplets, PhoneCall, AlertTriangle, Navigation, AlertCircle, Check } from 'lucide-react-native';
import { SOSButton } from '@/components/SOSButton';
import { SHELTERS, HOSPITALS, DANGERS, USER_LOC } from '@/constants/mockData';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(USER_LOC);
  const [isSosActive, setIsSosActive] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [lastSync, setLastSync] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    setUser({
      name: 'Krish Patel',
      email: 'krish@example.com',
      picture: 'https://i.pravatar.cc/100',
    });
    setShowLoginModal(false);
  };

  const handleSMSLogin = () => {
    if (!isOtpSent) {
      if (phoneNumber.length >= 10) {
        setIsOtpSent(true);
        // In real app, call backend to send OTP
        console.log(`Sending OTP to ${phoneNumber}`);
      }
    } else {
      if (otp === '1234') { // Mock OTP
        setUser({
          name: 'SMS User',
          phone: phoneNumber,
          picture: 'https://i.pravatar.cc/100',
        });
        setShowLoginModal(false);
      } else {
        alert('Invalid OTP (Try 1234)');
      }
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Watch location
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (newLoc) => {
          setLocation({
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
          });
        }
      );
    })();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSosActive) {
      interval = setInterval(() => setLastSync(prev => prev + 1), 1000);
    } else {
      setLastSync(0);
    }
    return () => clearInterval(interval);
  }, [isSosActive]);

  const handleSOS = () => {
    setIsSosActive(true);
  };

  return (
    <View style={styles.container}>
      {/* Top Header Overlay */}
      {!isSosActive && (
        <View style={styles.headerOverlay}>
          <Text style={styles.brandText}>CODECURE</Text>
          <TouchableOpacity onPress={() => user ? null : setShowLoginModal(true)}>
            {user ? (
              <View style={styles.profileBadge}>
                <Text style={styles.profileName}>{user.name.split(' ')[0]}</Text>
              </View>
            ) : (
              <View style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>Login</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...USER_LOC,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={location} title="You">
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>

        {SHELTERS.map(s => (
          <Marker
            key={s.id}
            coordinate={s.coords}
            onPress={() => setSelectedMarker(s)}
          >
            <View style={[styles.customMarker, { backgroundColor: '#34c759' }]}>
              <Text style={styles.markerText}>S</Text>
            </View>
          </Marker>
        ))}

        {HOSPITALS.map(h => (
          <Marker
            key={h.id}
            coordinate={h.coords}
            onPress={() => setSelectedMarker(h)}
          >
            <View style={[styles.customMarker, { backgroundColor: '#007aff' }]}>
              <Text style={styles.markerText}>H</Text>
            </View>
          </Marker>
        ))}

        {DANGERS.map(d => (
          <Circle
            key={d.id}
            center={d.coords}
            radius={d.radius}
            fillColor="rgba(255, 59, 48, 0.2)"
            strokeColor="#ff3b30"
            strokeWidth={1}
          />
        ))}
      </MapView>

      {/* Overlays */}
      {isSosActive && (
        <View style={styles.sosHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Shield size={20} color="white" />
            <Text style={styles.sosHeaderText}>SOS ACTIVE</Text>
          </View>
          <Text style={styles.syncText}>SYNC: {lastSync}s</Text>
        </View>
      )}

      {/* SOS Button */}
      {!isSosActive && (
        <View style={styles.sosFab}>
          <SOSButton onSOS={handleSOS} isActive={isSosActive} />
        </View>
      )}

      {/* Navigation Button */}
      <TouchableOpacity style={styles.navFab}>
        <Navigation size={24} color="#007aff" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { height: isSosActive ? 220 : 320 }]}>
        <View style={styles.dragHandle} />
        
        {isSosActive ? (
          <View style={styles.activeSosContent}>
            <AlertCircle size={48} color="#ff3b30" />
            <Text style={styles.activeSosTitle}>RESCUE ACTIVE</Text>
            <Text style={styles.activeSosDesc}>Broadcasting GPS coordinates. Help is being routed.</Text>
            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => setIsSosActive(false)}
            >
              <Text style={styles.cancelBtnText}>CANCEL EMERGENCY</Text>
            </TouchableOpacity>
          </View>
        ) : selectedMarker ? (
          <View style={styles.detailsContent}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{selectedMarker.name}</Text>
              <TouchableOpacity onPress={() => setSelectedMarker(null)}>
                <Text style={{ color: '#8b949e', fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsText}>
              {selectedMarker.beds !== undefined ? `🛏 Available Beds: ${selectedMarker.beds}` : `📊 Occupancy: ${selectedMarker.capacity}`}
            </Text>
            <View style={styles.chipContainer}>
              {selectedMarker.resources?.map((r: string) => (
                <View key={r} style={styles.chip}><Text style={styles.chipText}>{r}</Text></View>
              ))}
              {selectedMarker.emergency && <View style={styles.chip}><Text style={styles.chipText}>🚨 Emergency</Text></View>}
            </View>
          </View>
        ) : (
          <ScrollView style={styles.scrollContent}>
            <View style={styles.statusCard}>
              <Check size={24} color="#34c759" />
              <View>
                <Text style={styles.statusTitle}>System Status: Secure</Text>
                <Text style={styles.statusDesc}>No active threats detected in your area.</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>SAFETY GUIDELINES</Text>
            <View style={styles.guidelineItem}>
              <Zap size={20} color="#ffcc00" />
              <View>
                <Text style={styles.guideTitle}>Battery</Text>
                <Text style={styles.guideDesc}>Keep phone &gt; 50%. Enable low power mode.</Text>
              </View>
            </View>
            <View style={styles.guidelineItem}>
              <Droplets size={20} color="#34c759" />
              <View>
                <Text style={styles.guideTitle}>Resources</Text>
                <Text style={styles.guideDesc}>Store 2L of water and essential medication.</Text>
              </View>
            </View>
            <View style={styles.guidelineItem}>
              <PhoneCall size={20} color="#007aff" />
              <View>
                <Text style={styles.guideTitle}>Line 112</Text>
                <Text style={styles.guideDesc}>Call 112 for search & rescue requests.</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join CODECURE</Text>
              <TouchableOpacity onPress={() => setShowLoginModal(false)}>
                <Text style={{ color: '#8b949e', fontSize: 24 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.oauthBtn} onPress={handleGoogleLogin}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.googleIconPlaceholder} />
                <Text style={styles.oauthBtnText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR SMS LOGIN</Text>
              <View style={styles.line} />
            </View>

            {!isOtpSent ? (
              <View style={styles.smsContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <TouchableOpacity style={styles.smsBtn} onPress={handleSMSLogin}>
                  <Text style={styles.smsBtnText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.smsContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor="#555"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                />
                <TouchableOpacity style={styles.smsBtn} onPress={handleSMSLogin}>
                  <Text style={styles.smsBtnText}>Verify OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                  <Text style={styles.resendText}>Change Number</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerOverlay: {
    position: 'absolute', top: 50, left: 20, right: 20, zIndex: 1000,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  brandText: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  profileName: { color: 'white', fontSize: 12, fontWeight: '700' },
  loginBtn: {
    backgroundColor: '#007aff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20
  },
  loginBtnText: { color: 'white', fontWeight: '800', fontSize: 12 },
  map: { width, height: height - 100 },
  userMarker: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,122,255,0.3)',
    justifyContent: 'center', alignItems: 'center'
  },
  userMarkerInner: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#007aff',
    borderWidth: 2, borderColor: 'white'
  },
  customMarker: {
    width: 32, height: 32, borderRadius: 8, transform: [{ rotate: '45deg' }],
    borderWidth: 2, borderColor: 'white', justifyContent: 'center', alignItems: 'center'
  },
  markerText: {
    color: 'white', fontWeight: '900', fontSize: 12, transform: [{ rotate: '-45deg' }]
  },
  sosHeader: {
    position: 'absolute', top: 50, left: 0, right: 0,
    backgroundColor: '#ff3b30', padding: 15, paddingTop: 40,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 1000
  },
  sosHeaderText: { color: 'white', fontWeight: '900', letterSpacing: 1.5 },
  syncText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700' },
  sosFab: { position: 'absolute', bottom: 340, right: 20, zIndex: 1000 },
  navFab: {
    position: 'absolute', bottom: 270, right: 20, zIndex: 1000,
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(31,34,41,0.9)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1c1c1e', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 20
  },
  dragHandle: {
    width: 40, height: 4, backgroundColor: '#3a3a3c', borderRadius: 2,
    alignSelf: 'center', marginBottom: 15
  },
  activeSosContent: { alignItems: 'center', gap: 15 },
  activeSosTitle: { color: '#ff3b30', fontSize: 24, fontWeight: '900' },
  activeSosDesc: { color: '#8b949e', textAlign: 'center', fontSize: 14 },
  cancelBtn: {
    backgroundColor: '#2c2c2e', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24
  },
  cancelBtnText: { color: 'white', fontWeight: '800' },
  detailsContent: { gap: 15 },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailsTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  detailsText: { color: '#8b949e', fontSize: 14 },
  chipContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    backgroundColor: 'rgba(52,199,89,0.1)', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(52,199,89,0.2)'
  },
  chipText: { color: '#34c759', fontSize: 10, fontWeight: '700' },
  scrollContent: { flex: 1 },
  statusCard: {
    flexDirection: 'row', gap: 15, alignItems: 'center', backgroundColor: 'rgba(52,199,89,0.05)',
    padding: 15, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(52,199,89,0.1)',
    marginBottom: 20
  },
  statusTitle: { color: 'white', fontWeight: '800' },
  statusDesc: { color: '#8b949e', fontSize: 12 },
  sectionTitle: { color: '#555', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  guidelineItem: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  guideTitle: { color: 'white', fontSize: 14, fontWeight: '700' },
  guideDesc: { color: '#8b949e', fontSize: 12 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#1c1c1e', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 30, paddingBottom: 50, gap: 20
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  oauthBtn: {
    backgroundColor: 'white', paddingVertical: 14, borderRadius: 16, alignItems: 'center'
  },
  oauthBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  googleIconPlaceholder: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4285F4' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 15, marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { color: '#555', fontSize: 12, fontWeight: '800' },
  smsContainer: { gap: 15 },
  input: {
    backgroundColor: '#2c2c2e', color: 'white', padding: 15, borderRadius: 12, fontSize: 16
  },
  smsBtn: {
    backgroundColor: '#007aff', paddingVertical: 14, borderRadius: 16, alignItems: 'center'
  },
  smsBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
  resendText: { color: '#007aff', textAlign: 'center', fontSize: 12, fontWeight: '700' }
});

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];
