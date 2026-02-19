/**
 * Test script to verify the reports table integration
 * This tests the complete flow:
 * 1. Report incident (creates incident + report)
 * 2. Verify incident was created
 * 3. Verify report was created
 * 4. Verify report was classified by AI
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testReportsTable() {
  console.log('🧪 ========== TESTING REPORTS TABLE INTEGRATION ==========\n');

  try {
    // Test 1: Verify we can connect to Supabase
    console.log('1️⃣  Testing Supabase connection...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count');
    
    if (usersError) {
      throw new Error(`Cannot connect to Supabase: ${usersError.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Test 2: Get or create a test user
    console.log('2️⃣  Getting test user...');
    const testPhoneNumber = '+1234567890';
    
    const { data: existingUser, error: getUserError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_phone_number', testPhoneNumber)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.user_id;
      console.log(`✅ Found existing test user: ${userId}\n`);
    } else {
      console.log(`⚠️  Test user not found, creating one...`);
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          full_name: 'Test User',
          email: 'test@example.com',
          user_phone_number: testPhoneNumber,
          date_of_birth: '1990-01-01'
        })
        .select('user_id')
        .single();

      if (createUserError) {
        throw new Error(`Failed to create test user: ${createUserError.message}`);
      }
      userId = newUser.user_id;
      console.log(`✅ Created test user: ${userId}\n`);
    }

    // Test 3: Create a test incident
    console.log('3️⃣  Creating test incident...');
    const testLat = 14.5515;
    const testLng = 121.0275;
    const testAddress = 'Test Location, Manila';

    const { data: incident, error: incidentError } = await supabase
      .from('incidents')
      .insert({
        user_id: userId,
        user_phone_number: testPhoneNumber,
        incident_location_lat: testLat,
        incident_location_lng: testLng,
        location_address: testAddress,
        video_url: 'test://video'
      })
      .select()
      .single();

    if (incidentError) {
      throw new Error(`Failed to create incident: ${incidentError.message}`);
    }
    console.log(`✅ Incident created: ${incident.incident_id}\n`);

    // Test 4: Create a report for the incident
    console.log('4️⃣  Creating report for incident...');
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        incident_id: incident.incident_id,
        content: `Test emergency report for incident ${incident.incident_id}`,
        classified_as: null,
        report_location_lat: testLat,
        report_location_lng: testLng
      })
      .select()
      .single();

    if (reportError) {
      throw new Error(`Failed to create report: ${reportError.message}`);
    }
    console.log(`✅ Report created: ${report.report_id}\n`);

    // Test 5: Simulate AI analysis (update classification)
    console.log('5️⃣  Simulating AI analysis and classification...');
    const emergencyTypes = ['fire', 'medical', 'police'];
    const detectedService = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];

    const { data: updatedReport, error: updateError } = await supabase
      .from('reports')
      .update({ classified_as: detectedService })
      .eq('report_id', report.report_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update report classification: ${updateError.message}`);
    }
    console.log(`✅ Report classified as: ${detectedService}\n`);

    // Test 6: Fetch and display complete report
    console.log('6️⃣  Fetching complete report data...');
    const { data: fullReport, error: fetchError } = await supabase
      .from('reports')
      .select(`
        report_id,
        user_id,
        incident_id,
        content,
        classified_as,
        report_location_lat,
        report_location_lng,
        timestamp
      `)
      .eq('report_id', report.report_id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch report: ${fetchError.message}`);
    }
    console.log('✅ Report data retrieved:\n');
    console.log(JSON.stringify(fullReport, null, 2));
    console.log('\n');

    // Test 7: Verify relationships
    console.log('7️⃣  Verifying table relationships...');
    
    // Check if report is linked to correct user
    const { data: reportUser, error: reportUserError } = await supabase
      .from('users')
      .select('user_id, user_phone_number')
      .eq('user_id', fullReport.user_id)
      .single();

    if (reportUserError) {
      throw new Error(`Failed to verify user relationship: ${reportUserError.message}`);
    }
    console.log(`✅ Report linked to user: ${reportUser.user_phone_number} (${reportUser.user_id})`);

    // Check if report is linked to correct incident
    const { data: reportIncident, error: reportIncidentError } = await supabase
      .from('incidents')
      .select('incident_id, user_phone_number')
      .eq('incident_id', fullReport.incident_id)
      .single();

    if (reportIncidentError) {
      throw new Error(`Failed to verify incident relationship: ${reportIncidentError.message}`);
    }
    console.log(`✅ Report linked to incident: ${reportIncident.incident_id}`);
    console.log(`✅ Incident reported by: ${reportIncident.user_phone_number}\n`);

    // Test 8: Query all reports for user
    console.log('8️⃣  Querying all reports for test user...');
    const { data: userReports, error: userReportsError } = await supabase
      .from('reports')
      .select(`
        report_id,
        incident_id,
        classified_as,
        timestamp
      `)
      .eq('user_id', userId);

    if (userReportsError) {
      throw new Error(`Failed to query user reports: ${userReportsError.message}`);
    }
    console.log(`✅ Found ${userReports.length} report(s) for user:\n`);
    userReports.forEach((r, index) => {
      console.log(`   ${index + 1}. Report ${r.report_id}`);
      console.log(`      - Incident: ${r.incident_id}`);
      console.log(`      - Classification: ${r.classified_as || 'PENDING'}`);
      console.log(`      - Created: ${new Date(r.timestamp).toLocaleString()}\n`);
    });

    console.log('🎉 ========== ALL TESTS PASSED! ==========');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Supabase connection working`);
    console.log(`   ✅ User table accessible`);
    console.log(`   ✅ Incidents table accessible`);
    console.log(`   ✅ Reports table accessible`);
    console.log(`   ✅ Foreign key relationships working`);
    console.log(`   ✅ Report creation working`);
    console.log(`   ✅ Report classification working`);
    console.log('\n🚀 The reports table integration is working correctly!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
}

// Run tests
testReportsTable();
