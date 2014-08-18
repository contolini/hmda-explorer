var fileMap = {
	'endpoint': 'https://qu.demo.cfpb.gov/data/hmda/slice/',
	'slices': [
		{	'sliceName': 'hmda_lar',
			'selectStatement': '&$select=tract_to_msamd_income,rate_spread,population,minority_population,number_of_owner_occupied_units,number_of_1_to_4_family_units,loan_amount_000s,hud_median_family_income,applicant_income_000s,state_name,state_abbr,sequence_number,respondent_id,purchaser_type_name,property_type_name,preapproval_name,owner_occupancy_name,msamd_name,loan_type_name,loan_purpose_name,lien_status_name,hoepa_status_name,edit_status_name,denial_reason_name_3,denial_reason_name_2,denial_reason_name_1,county_name,co_applicant_sex_name,co_applicant_race_name_5,co_applicant_race_name_4,co_applicant_race_name_3,co_applicant_race_name_2,co_applicant_race_name_1,co_applicant_ethnicity_name,census_tract_number,as_of_year,application_date_indicator,applicant_sex_name,applicant_race_name_5,applicant_race_name_4,applicant_race_name_3,applicant_race_name_2,applicant_race_name_1,applicant_ethnicity_name,agency_name,agency_abbr,action_taken_name',
			'staticFiles':{
				
				// First-lein, owner-occupied, 1-4 family homes (for each year)
				'&$where=as_of_year=2012+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar',
				'&$where=as_of_year=2011+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar2011filenamechangetest',
				'&$where=as_of_year=2010+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar',
				'&$where=as_of_year=2009+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar',
				'&$where=as_of_year=2008+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar',
				'&$where=as_of_year=2007+AND+property_type+IN+(1,2)+AND+owner_occupancy=1+AND+action_taken=1+AND+lien_status=1': 'hmda_lar',
				
				// All Originations (for each year)
				'&$where=as_of_year=2012+AND+action_taken=1': 'hmda_lar',
				'&$where=as_of_year=2011+AND+action_taken=1': 'hmda_lar',
				'&$where=as_of_year=2010+AND+action_taken=1': 'hmda_lar',
				'&$where=as_of_year=2009+AND+action_taken=1': 'hmda_lar',
				'&$where=as_of_year=2008+AND+action_taken=1': 'hmda_lar',
				'&$where=as_of_year=2007+AND+action_taken=1': 'hmda_lar',

				// All Records (for each year)
				'&$where=as_of_year=2012': 'hmda_lar',
				'&$where=as_of_year=2011': 'hmda_lar',
				'&$where=as_of_year=2010': 'hmda_lar',
				'&$where=as_of_year=2009': 'hmda_lar',
				'&$where=as_of_year=2008': 'hmda_lar',
				'&$where=as_of_year=2007': 'hmda_lar',

				// All Records (tota)
				'&': '/hmda_lar'
			}
		},
		{	'sliceName': 'census_tracts',
			'selectStatement': '',
			'staticFiles':{
				'': 'file/location/myfile'
			}
		}
	]
};