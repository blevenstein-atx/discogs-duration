Discogs Duration Project Test Data

The IDs map to the requirememnts IDs in the PRD.

# Input Validation

**IV-2**


Input: gorrilaz demon days

Expected result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: discogs.com/release/547049-Gorillaz-Demon-Days


Expected result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: discogs.com/ release /547049-Gorillaz-Demon-Days


Expected result: Display a message: Please enter a valid Discogs release URL or release ID.

**IV-3**


Input: r547049


Expected Result: Value is accepted

Input: [r547049]


Expected Result: Value is accepted

Input: 547049


Expected Result: Value is accepted

Input: 5470 49


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: 5470.49


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: 00547049


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: 00000


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: (r58002)


Expected Result: Display a message: Please use a specific release URL or ID.

**IV-4**


Input: R547049


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

Input: [ r547049 ]


Expected Result: Display a message: Please enter a valid Discogs release URL or release ID.

**IV-5**


Input: https://www.discogs.com/master/58002-Gorillaz-Demon-Days


Expected Result: Display a message: Please use a specific release URL or ID.

Input: https://www.discogs.com/artist/6378-Gorillaz


Expected Result: Display a message: Please use a specific release URL or ID.

Input: https://www.discogs.com/label/2294-Parlophone


Expected Result: Display a message: Please use a specific release URL or ID.


**IV-6**


Input: m58002


Expected Result: Display a message: Please use a specific release URL or ID.

Input: [m58002]


Expected Result: Display a message: Please use a specific release URL or ID.


# Results UI

**RU-5, RU-6**


Example discogs URL: https://www.discogs.com/release/25863751-New-Order-Low-Life

**RU-7**


Example discogs URL: https://www.discogs.com/release/2240787-Tony-Bennett-Bill-Evans-The-Tony-Bennett-Bill-Evans-Album


# Duration Calculation, Success Cases

**DC-3**


Example discogs URL: https://www.discogs.com/release/46547-Neworder-Technique


Example discogs URL: https://www.discogs.com/release/100227-New-Order-Ceremony


Example discogs URL: https://www.discogs.com/release/580247-The-Beatles-We-Can-Work-It-Out-Day-Tripper

Example discogs URL: https://www.discogs.com/release/147632-Neworder-Technique

**DC-4**


Example discogs URL: https://www.discogs.com/release/1532118-New-Order-Technique

**DC-5**


Example discogs URL: https://www.discogs.com/release/32391060-New-Order-Brotherhood

**DC-6**


Example discogs URL: https://www.discogs.com/master/192783-Kate-Bush-This-Womans-Work-Anthology-1978-1990

**DC-7**


Example discogs URL: https://www.discogs.com/release/4000806-Genesis-The-Lamb-Lies-Down-On-Broadway


# Duration Calculation, Success Cases

**DF-1**


To be tested with mocked/synthetic API response data.

**DF-2**


Example discogs URL: https://www.discogs.com/release/191013-New-Order-Peel-Sessions
Example discogs URL: https://www.discogs.com/release/16000948-New-Order-Power-Corruption-And-Lies

**DF-3**


Example discogs URL: https://www.discogs.com/release/16000948-New-Order-Power-Corruption-And-Lies

**DF-4**


To be tested with mocked/synthetic API response data.

**DF-5**


To be tested with mocked/synthetic API response data for a 404 error.

**DF-6**


To be tested with mocked/synthetic API response data for a 410 error.


# API/Network failures

**AF-1**


To be tested with mocked/synthetic API response data.