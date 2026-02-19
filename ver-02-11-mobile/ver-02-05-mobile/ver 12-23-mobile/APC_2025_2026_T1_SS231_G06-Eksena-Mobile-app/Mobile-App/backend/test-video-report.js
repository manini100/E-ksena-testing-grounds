/**
 * Diagnostic script to test the complete incident reporting flow
 * This mimics what the mobile app does when sending a video report
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testVideoReportFlow() {
  console.log('\n🧪 ========== TESTING VIDEO REPORT FLOW ==========\n');

  const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3000/api';
  const testPhone = '+1234567890';
  const testLat = 14.5515;
  const testLng = 121.0275;
  const testAddress = 'Test Location, Manila';

  try {
    // Step 1: Check backend connectivity
    console.log('1️⃣  Checking backend server connectivity...');
    const healthUrl = API_BASE_URL.replace('/api', '') + '/health';
    console.log(`   Testing: ${healthUrl}`);
    
    try {
      const healthRes = await fetch(healthUrl, { method: 'GET' });
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        console.log('✅ Backend server is running');
        console.log(`   Status: ${healthData.status}`);
        console.log(`   Service: ${healthData.service}\n`);
      } else {
        console.log(`⚠️  Backend returned status: ${healthRes.status}\n`);
      }
    } catch (err) {
      console.error('❌ BACKEND SERVER NOT RUNNING');
      console.error(`   Cannot connect to: ${healthUrl}`);
      console.error(`   Make sure to run: cd backend && npm start\n`);
      throw err;
    }

    // Step 2: Check Supabase connectivity
    console.log('2️⃣  Checking Supabase connectivity...');
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('count');
    
    if (testError) {
      throw new Error(`Supabase error: ${testError.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Step 3: Ensure test user exists
    console.log('3️⃣  Ensuring test user exists in database...');
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_phone_number', testPhone)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.user_id;
      console.log(`✅ Test user exists: ${userId}\n`);
    } else {
      console.log(`   Creating test user...`);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          full_name: 'Test User',
          email: 'test@example.com',
          user_phone_number: testPhone,
          date_of_birth: '1990-01-01'
        })
        .select('user_id')
        .single();

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }
      userId = newUser.user_id;
      console.log(`✅ Test user created: ${userId}\n`);
    }

    // Step 4: Send incident report via API (like the mobile app does)
    console.log('4️⃣  Sending incident report via API...');
    const reportUrl = `${API_BASE_URL}/report-incident`;
    const reportPayload = {
      lat: testLat,
      lng: testLng,
      user_phone_number: testPhone,
      location_address: testAddress,
      video_url: 'test://video.mp4'
    };

    console.log(`   POST ${reportUrl}`);
    console.log(`   Payload: ${JSON.stringify(reportPayload, null, 2)}`);

    const reportRes = await fetch(reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload)
    });

    if (!reportRes.ok) {
      const errorData = await reportRes.json();
      throw new Error(`API error (${reportRes.status}): ${JSON.stringify(errorData)}`);
    }

    const reportData = await reportRes.json();
    console.log('✅ Report sent successfully\n');
    console.log(`   Response: ${JSON.stringify(reportData, null, 2)}\n`);

    const incidentId = reportData.incident_id;

    // Step 5: Verify incident was created in database
    console.log('5️⃣  Verifying incident in database...');
    await new Promise(r => setTimeout(r, 2000)); // Wait for database to write

    const { data: incident, error: incidentError } = await supabase
      .from('incidents')
      .select('*')
      .eq('incident_id', incidentId)
      .single();

    if (incidentError) {
      throw new Error(`Could not find incident: ${incidentError.message}`);
    }

    console.log('✅ Incident found in database');
    console.log(`   ID: ${incident.incident_id}`);
    console.log(`   Phone: ${incident.user_phone_number}`);
    console.log(`   Location: ${incident.incident_location_lat}, ${incident.incident_location_lng}`);
    console.log(`   Address: ${incident.location_address}`);
    console.log(`   Video: ${incident.video_url}`);
    console.log(`   Created: ${incident.created_at}\n`);

    // Step 6: Check for AI analysis
    console.log('6️⃣  Checking for AI analysis...');
    const { data: aiAnalysis } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('incident_id', incidentId)
      .single();

    if (aiAnalysis) {
      console.log('✅ AI analysis found');
      console.log(`   Service Type: ${aiAnalysis.detected_service_type}`);
      console.log(`   Confidence: ${aiAnalysis.confidence_score}\n`);
    } else {
      console.log('⚠️  AI analysis not yet created (this may be normal)\n');
    }

    // Step 7: Check for report record
    console.log('7️⃣  Checking for report record...');
    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('incident_id', incidentId)
      .single();

    if (report) {
      console.log('✅ Report record found');
      console.log(`   Report ID: ${report.report_id}`);
      console.log(`   User ID: ${report.user_id}`);
      console.log(`   Content: ${report.content}`);
      console.log(`   Classified As: ${report.classified_as || 'PENDING'}\n`);
    } else {
      console.log('⚠️  Report record not found\n');
    }

    // Step 8: Check for dispatch
    console.log('8️⃣  Checking for dispatch assignment...');
    const { data: dispatch } = await supabase
      .from('dispatch')
      .select('*')
      .eq('incident_id', incidentId)
      .single();

    if (dispatch) {
      console.log('✅ Dispatch assignment found');
      console.log(`   Responder ID: ${dispatch.responder_id}`);
      console.log(`   Status: ${dispatch.status}\n`);
    } else {
      console.log('⚠️  Dispatch not yet assigned\n');
    }

    console.log('🎉 ========== TEST PASSED! ==========');
    console.log('\n✅ Summary:');
    console.log('   ✅ Backend server is running');
    console.log('   ✅ Supabase is accessible');
    console.log('   ✅ Incident was created in database');
    console.log('   ✅ Video report flow is working!\n');

  } catch (error) {
    console.error('\n❌ ========== TEST FAILED! ==========\n');
    console.error(`Error: ${error.message}\n`);
    
    console.log('🔍 Troubleshooting steps:\n');
    console.log('1. Is the backend server running?');
    console.log('   Run: cd backend && npm start\n');
    
    console.log('2. Is the API_BASE_URL correct?');
    console.log(`   Currently set to: ${API_BASE_URL}`);
    console.log('   Check your .env file\n');
    
    console.log('3. Check backend logs for errors\n');
    
    process.exit(1);
  }
}

testVideoReportFlow();
