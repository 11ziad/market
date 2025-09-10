import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
fontFamily: 'Times-Roman'
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#1a73e8',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight : '30px'
  },
});

const Pdfdocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>  name</Text>
      </View>
      <View style={styles.section}>
        <Text><Text style={styles.label}>name:</Text> {data.name}</Text>
        <Text><Text style={styles.label}>email:</Text> {data.email}</Text>
      </View>
    </Page>
  </Document>
);

export default Pdfdocument;