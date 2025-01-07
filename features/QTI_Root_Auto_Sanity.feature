Feature: Root Sanity Testing

@sanity1 @test
Scenario: E2E Root TX - Single Driver/Single Vehicle.
  Given the "dev" Aviator page is loaded
  When Select the address "8607 Concerto Cir, Houston, TX 77040, USA" from Google API suggestions in textbox with label "What is the address you want to quote?"
  And Select value "Other" for dropdown with label "Select the client’s lead source type."
  And Click on button with title "Let’s Do This"
  And Click on link with title "Only Quote Auto"
  And Enter personal details FirstName, LastName, Suffix, Birthdate, Gender, MaritalStatus, Mobile Number, Email, Social Security, Language as "Richard","King","","07071977","Male","Single","4945436738","leosaun@test.com","","English" respectively
  And Enter random email in About You page
  And Click on button with title "Continue"
  Then Check if text "Drivers" is present on the screen
  And Delete existing pre-populated drivers
  #Then For "Leon Day, Sr", the counter should be "2 of 2"
  And Add 0 Drivers License Number, License State, Education and Occupation as "12345678","TX","Technical or Vocational School","Athlete - Sports/Recreation" respectively
  And Click on button with title "Continue"
  Then Check if text "Vehicles" is present on the screen
  And Delete existing pre-populated vehicles
  Then Check if text "New Vehicle" is present on the screen
  And Add 0 Vehicles VIN as "JH4DA9340NS001774"
  Then Check if text "Model" is present on the screen
  And Click on button with title "Continue"
  Then Check if text "New Auto Policy" is present on the screen
  And Select value "Other - Standard" for dropdown with label "Prior Carrier"
  And Enter value "3" in the textbox with label "Years with Prior Carrier"
  And Select value "250/500" for dropdown with label "Prior Liability Limits"
  And Click on "Submit" and wait for response page to Load
  Then Check if text "Auto" is present on the screen
  And Click on "Checkout" for "Auto" carrier "Root"
  And switch to QTI tab
  And Click on button with title "Continue"
  And Check if text "Driver Review" is present on the screen
  And Select the describes "1" driver option as "Already Quoted"
  And Click on button with title "Continue"
  And Select the describes "0" vehicle option as "Already Quoted"
  And Select the describes "1" vehicle option as "Already Quoted"
  And Select the assignedDriver and Ownership status as "Richard King" as "Own" for vehicle 0
  And Click on button with title "Continue"
  And Select the "input-rideshareStatus" as "No"
  And Click on button with title "Continue"
  And Click on "Consumer Reporting Disclosure" checkbox in summary page
  And Click on button with title "Continue & Run Reports"
  Then Check if text "Here is the final rate!" is present on the screen
  And Click on button with title "Continue to Checkout"
  And Click on button with title "Next Step"
  And Wait for 20 seconds
  And Check if text "I understand that I must answer all questions correctly to return an accurate rate." is present on the screen
  And Enter the card details creditCardholderName,creditCardNumber,ExpirationDT & CVV as "Richie Test","4111 1111 1111 1111", "03/30", "737" respectively
  And Click on button with title "Next Step"
  And Click on "your submission" checkbox
  And Click on button with title "Pay Now"
  And Wait for 20 seconds
  Then Check if text "Success!" is present on the screen


  @test2
  Scenario: AR - Verify Responses page for Auto Only - Domestic Partner - 2 Drivers/2 Vehicles - 2022/1985 VIN - Prior Liability 10/20 - BI 100/300 - 2 Comp Losses/1 Violation.
    Given the "test" Aviator page is loaded
    When Select the address "5128 Kite Rd, Grand Prairie, TX 75052, USA" from Google API suggestions in textbox with label "What is the address you want to quote?"
    And Select value "Other" for dropdown with label "Select the client’s lead source type."
    And Click on button with title "Let’s Do This"
    And Click on link with title "Only Quote Auto"
    And Enter personal details FirstName, LastName, Suffix, Birthdate, Gender, MaritalStatus, Mobile Number, Email, Social Security, Language as "Lance","Quick","","11021993","Male","Domestic Partner","7047471885","Quick.lance@test.com","","English" respectively
    And Enter random email in About You page
    And Enter spouse details FirstName, LastName, Suffix, Birthdate, Gender, Mobile Number, Email, Social Security, Language as "Mac","Rice","","08171987","Male","3618019265","","526843876","Spanish" respectively
    And Click on button with title "Continue"
    Then Check if text "Drivers" is present on the screen
    And Delete existing pre-populated drivers
    And Add 0 Drivers License Number, License State, Education and Occupation as "12345678","TX","Master's Degree","Clerk - Mfg/Production" respectively
    And Add 1 Drivers License Number, License State, Education and Occupation as "988628615","VA","Advanced or Doctorate Degree","Client Care Worker - Med/Soc Svcs/Relig" respectively
    And Click on button with title "Add Driver"
    And Add 2 Driver details FirstName, LastName, Suffix, Birthdate, Gender, License Number, License State, Education and Occupation as "Meryl","Streep","","12122000","Female","QB451395","OH","Military Service","Pet Services - Person.Care/Service" respectively
    And Click on button with title "Continue"
    #Add 1st vehicle Year, Make and Model
    Then Check if text "Vehicles" is present on the screen
    And Delete existing pre-populated vehicles
    Then Check if text "New Vehicle" is present on the screen
    And Add 0 Vehicles VIN as "JH4DA9340NS001774"
    Then Check if text "Model" is present on the screen
    And Click on button with title "Add Vehicle"
    And Add 1 Vehicles VIN as "1B3BG26P3FX513068"
    Then Check if text "1985 DODGE DIPLOMAT" is present on the screen
    And Click on button with title "Add Vehicle"
    And Add 2 Vehicles VIN as "1N6AA0EC8CN306095"
    Then Check if text "NISSAN" is present on the screen
    And Click on button with title "Add Vehicle"
    And Add 3 Vehicles VIN as "5TFMV52127X018233"
    Then Check if text "TOYOTA" is present on the screen
    And Click on button with title "Add Vehicle"
    And Add 4 Vehicles VIN as "3HGGK5G52HM705903"
    Then Check if text "HONDA " is present on the screen
    And Click on button with title "Add Vehicle"
    And Add 5 Vehicles VIN as "2HGFC3B94GH355484"
    Then Check if text "HONDA" is present on the screen
    And Click on button with title "Continue"
    Then Check if text "New Auto Policy" is present on the screen
    And Select value "Other - Standard" for dropdown with label "Prior Carrier"
    And Enter value "3" in the textbox with label "Years with Prior Carrier"
    And Select value "250/500" for dropdown with label "Prior Liability Limits"
    And Click on "Submit" and wait for response page to Load
    #Verify if Auto quotes are present in the Response page
    Then Check if text "Auto" is present on the screen
    And Click on "Checkout" for "Auto" carrier "Root"
    And switch to QTI tab
    And Click on button with title "Continue"
    And Check if text "Driver Review" is present on the screen
    And Select the describes "1" driver option as "Already Quoted"
    And Click on link with text "Add A Driver"
    And Click on button with title "Continue"
    And Add 3 Driver details FirstName,LastName,Suffix,CoverageStatus,MartialStatus,Birthdate,Gender,License State,License Number,ageLicensedInput and yearsLicensed as "Sam","James","Sr.","Covered","Single","11111999","Female","PA","17909519","16","More than 3 years" respectively in QTI
    And Click on link with text "Add A Driver"
    And Add 4 Driver details FirstName,LastName,Suffix,CoverageStatus,MartialStatus,Birthdate,Gender,License State,License Number,ageLicensedInput and yearsLicensed as "Sunny","James","Sr.","Covered","Single","02022000","Male","TX","08830177","16","More than 3 years" respectively in QTI
    And Click on link with text "Add A Driver"
    And Add 5 Driver details FirstName,LastName,Suffix,CoverageStatus,MartialStatus,Birthdate,Gender,License State,License Number,ageLicensedInput and yearsLicensed as "Gyan","James","Sr.","Covered","Single","11122001","Male","TX","32865619","16","More than 3 years" respectively in QTI
    And Click on button with title "Continue"
    And Select the describes "0" vehicle option as "Already Quoted"
    And Select the describes "1" vehicle option as "Already Quoted"
    And Select the assignedDriver and Ownership status as "Lance Quick" as "Own" for vehicle 0
    And Select the assignedDriver and Ownership status as "Mac Rice" as "Own" for vehicle 1
    And Select the assignedDriver and Ownership status as "Meryl Streep" as "Own" for vehicle 2
    And click on "forwardButton" arrow
    And Select the assignedDriver and Ownership status as "Sam James" as "Own" for vehicle 3
    And click on "forwardButton" arrow
    And Select the assignedDriver and Ownership status as "Sunny James" as "Own" for vehicle 4
    And click on "forwardButton" arrow
    And Select the assignedDriver and Ownership status as "Gyan James" as "Own" for vehicle 5
    And Click on link with text "Add A Vehicle"
    Then Check if text "New Vehicle" is present on the screen
    And Add 6 vehicles details Vin,coverageStatus,assignedDriver,GarageAdress,OwnershipStatus as "JTDBCMFE9PJ000299","Covered","Sunny James","Same as Primary Address","Own" in QTI
    And Click on link with text "Add A Vehicle"
    Then Check if text "New Vehicle" is present on the screen
    And Add 7 vehicles details Vin,coverageStatus,assignedDriver,GarageAdress,OwnershipStatus as "3N1AB8CV6PY256201","Covered","Mac Rice","Same as Primary Address","Own" in QTI
    And Click on link with text "Add A Vehicle"
    Then Check if text "New Vehicle" is present on the screen
    And Add 8 vehicles details Vin,coverageStatus,assignedDriver,GarageAdress,OwnershipStatus as "1N4BL4CV5RN301478","Covered","Sam James","Same as Primary Address","Own" in QTI
    And Click on link with text "Add A Vehicle"
    Then Check if text "New Vehicle" is present on the screen
    And Add 9 vehicles details Vin,coverageStatus,assignedDriver,GarageAdress,OwnershipStatus as "JTDBCMFE7RJ034471","Covered","Mac Rice","Same as Primary Address","Own" in QTI
    And Click on button with title "Continue"
    Then Check if text "Auto Coverage" is present on the screen
    And Select the "input-rideshareStatus" as "No"
    And Click on button with title "Continue"
    And Click on "Consumer Reporting Disclosure" checkbox in summary page
    And Click on button with title "Continue & Run Reports"
    And Wait for 20 seconds
    Then Check if text "Here is the final rate!" is present on the screen
    And Click on button with title "Continue to Checkout"
    And Select a Payment Frequency as "Full Pay"
    And Click on button with title "Next Step"
    And Wait for 20 seconds
    And Check if text "I understand that I must answer all questions correctly to return an accurate rate." is present on the screen
    And Enter the card details creditCardholderName,creditCardNumber,ExpirationDT & CVV as "Richie Test","4111 1111 1111 1111", "03/30", "737" respectively
    And Click on button with title "Next Step"
    And Click on "your submission" checkbox
    And Click on button with title "Pay Now"
    And Wait for 90 seconds
    Then Check if text "Success!" is present on the screen