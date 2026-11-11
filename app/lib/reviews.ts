// Guest reviews copied from the OwnerRez hosted listing pages (public review widgets).
// The OwnerRez Reviews API needs a paid add-on that isn't enabled, so these are a snapshot.
// Format per line: reviewer (first name + last initial) | stay month | title (optional) | review text
// All reviews are shown exactly as written by guests; owner replies are not included.
// To refresh: re-copy from the OwnerRez widget, or enable the API add-on (the sync route will then take over).

export type Review = {
  id: string
  rating: number
  title: string | null
  body: string
  reviewer: string
  date: string | null // ISO date (stay month, day set to the 15th)
}

const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
}

function parse(slug: string, raw: string): Review[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [reviewer, stay, title, ...rest] = line.split('|')
      const [mon, year] = stay.split(' ')
      return {
        id: `${slug}-${i}`,
        rating: 5,
        title: title || null,
        body: rest.join('|').trim(),
        reviewer,
        date: MONTHS[mon] && year ? `${year}-${MONTHS[mon]}-15` : null,
      }
    })
}

const CASA_GRANDE = `
Brian C|Feb 2026||The house was clean and nice. Lots of natural light and heated pool was great Sonya and Daksh were very accommodating and responsive the whole time.
David L|Dec 2025||Awesome place, exactly as described. Would stay again.
Bryan B|Dec 2025||We enjoyed our stay at Casa Grande’. The house is beautiful and the five bedrooms offer plenty of space to accommodate a large family. It is close to restaurants and local attractions. We enjoyed our stay.
Jeremy Y|Nov 2025||Great place to stay for our daughters' softball tournament. Would definitely rent again!!
Lynne D|Aug 2025||Beautiful home with exceptional amenities. Everything was as expected. We were impressed with how clean and tidy everything was. The kitchen was well-equipped and made us feel like home. The space was perfect for our large family. The host was very responsive and helpful throughout our stay.
Brenya M|Aug 2025||My family enjoyed our stay at Sonya’s place. She was communicative, helpful and responsive. Thank you Sonya :)
Nitesh R|Jul 2025||Recommend without any reservations. Comfortable place
Paul J|Jun 2025||Great stay the host provided everything. Beautiful home so much room. All and all A+
Jenifer M|Jun 2025||We enjoyed our stay. It was great to spend time with all of our kids and grandkids and family all under one roof.
Tarek M|Jun 2025||It was good. Exactly what we hoped for
Yoel F|May 2025||The house was perfect for what I needed. It was super clean and it had all I was looking for I will repeat it again
Natalie M|Apr 2025||Beautiful modern, well air conditioned home with plenty of space and seating for 7 of us. Bedrooms are lovely with comfy beds and fresh linen and towels provided. Quiet and private location. Lovely to come home to every evening. Pool is big enough for the whole family to swim in and great to relax on sunbeds. Sonya and Daksh are the best hosts. Immediately responsive any time of day and helped us work around our flight cancellation issues. Can’t get better than a host that cares about the people who stay at their property.
Nicola K|Apr 2025||We had a great stay overall! The house was clean and fully stocked with all bed linens, towels, kitchen utensils/appliances, etc. We were even provided toddler swim floaties, which was a huge bonus to not have to bring ours. Pool was perfect for our family with three young kids!The hosts were extremely accommodating with check in and very responsive when we reached out with questions. Would definitely stay here again and would recommend to others!
Teresa W|Mar 2025||This home was perfect for our family. Sonja was a joy to deal with, she was super helpful and quick to respond to any questions. We absolutely loved our stay in this beautiful home.
Bob & Maryann M|Mar 2025||Sonya’s place was extremely convenient and very comfortable for my friends and myself. House is very nice, good layout, well equipped kitchen and nice pool. Will look to stay here again when back in the area. Sonya was extremely responsive and acted promptly on any points we mentioned. Excellent experience.
Sydney S|Mar 2025||Can’t wait to go back and stay again
Sydney I|Mar 2025||We had a great time staying at Casa Grande for our 3-night girls weekend! The house was spacious, clean, and comfortably fitting our group of 10. The location was fine but the amenities provided everything we needed for a fun and relaxing stay. When we requested extra bath towels, the host was quick to provide them, though I’d recommend having plenty of hand towels, bath mats, and bath towels to accommodate large groups. They did have plenty of beach towels for us, which was great. The host also allowed us to check in early and was super communicative and responsive throughout our stay.One thing to note is that while the beach is accessible, it can be a bit of a drive, especially if the bridge has traffic. That said, the house was a great home base, and we still had a fantastic time! Communication with the host was easy, and we felt well taken care of. Would definitely recommend this place for any large!
Bianca M|Mar 2025||⭐️⭐️⭐️⭐️⭐️ Perfect Stay!This Airbnb was everything I could’ve hoped for! The location was unbeatable—just minutes from BayCare Ballpark, making it super easy to catch a game without the hassle of traffic. The beach was also close by, so I got the best of both worlds!The hosts provided an amazing trip guide that led me to the best local spots—great food, coffee shops, and hidden gems I wouldn’t have found on my own. The home itself was spotless, comfortable, and had everything I needed, from extra beach towels to a fully stocked kitchen.The hosts were responsive and made sure my stay was perfect. If you’re looking for a place that’s close to the stadium, the beach, and all the best local spots, this is it! I’ll definitely be booking again.
Colin B|Mar 2025||Great Stay!
Elton M|Jan 2025||We would definitely stay again. Five car drive away is a plus . Everything else was just perfect.
Heather & Aaron S|Dec 2024||This home is clean, comfortable, well equipped and host is very responsive! Would stay here again!
Jennifer C|Dec 2024||Casa Grande’ provided a comfortable and relaxing stay for my family week-end. We felt right at home and found that it was fully appointed with all the extras we needed! The house was nice and clean and felt cozy and welcoming.
Komal S|Nov 2024||Stayed for 3 nights to celebrate my bday with my friends! The house was amazing and awesome location! very modern and comforting with a beautiful pool! the host is very responsive and sweet!
Dana B|Oct 2024||This house was beyond perfect for our team for our masters synchronized swimming competition at The Long Center in Clearwater. Exactly as listed and plenty of room.
Denise D|Oct 2024||We had a lovely stay here, we came from Scotland for a family wedding. Beautiful home, great hosts.
Sophia D|Oct 2024||Sonya was awesome and so accommodating with the last minute changes due to the hurricanes. I appreciate all Sonya’s extra efforts of making it work during the difficult times
Sienna Nicole A|Sep 2024||Beautiful home very comfortable, clean and updated with a perfect pool..Thank you for a wonderful stay.
William R|Jul 2024||Thank you Sonya! House was great for our family. Liked the open floor plan in kitchen/living area. Pool was great. Thanks!Bill
Angela T|Jun 2024||Sonya and Daksh were amazing hosts. They went above and beyond and checked in to see if we needed anything. The rental is as described in the listing and the pictures are accurate. We had plenty of room for our group of 13. Our favorite part was floating in the spacious pool. I would definitely stay here again!
Jeremy J|Jun 2024||Any issues we had were quickly rectified. Responsive, friendly host. We had our wedding reception at this property. Turned out great.
Nakita M|May 2024||This home was perfect for my family trip which consisted of 6 adults and 5 children. The children loved the pool! Plenty of pool toys were there for them to enjoy. The kitchen was fully stocked. Sonya was such a great host who went above and beyond when it came to anything that we needed…We didn’t have an iron so I reached out to her and when we got back from the beach she had sent us over two! One thing to note is that all 3 of the bathrooms are on one side of the house. The two front bedroom guests will be sharing one of those 3 as they do not have one on the other side of the home. I would definitely book here again. Thanks for your hospitality.
Andrew S|May 2024|Stunning Vacation Home!|From the moment we arrived, we were swept away by the beauty of this immaculate property. Every corner exuded cleanliness and charm, making it the perfect retreat. Everything felt modern and new. The hosts were incredibly responsive and accommodating, ensuring our stay was seamless and memorable. Whether lounging in the pristine pool area or cozying up to watch a movie in the living room, every moment here was pure bliss. The location of the home is perfect! Close to everything you need, including the beach. This house is spacious too! We had two families with little kids and had more than enough space. There were pack and plays and a high chair available for use too. One thing that wasn’t mentioned in the description that we found very useful was beach equipment they had there for us to use as well. Coolers, kids chairs, a beach mat and umbrellas were exactly what we needed. If we ever take a vacation in Clearwater again, we’ll be sure to stay here!
Yoel P|Apr 2024||Really good equipped place for big groups!
Stu L|Apr 2024||Wonderful house!
Anna S|Apr 2024||We had a wonderful time at this spacious and beautiful airbnb. It was very family friendly and had a lot of amenities. The pool area was clean and spacious and the pool itself was well maintained. We enjoyed many hours just hanging out by the pool! It was also close to the beach and all the fun things to do down there. The welcome guide was filled with helpful tips and recommendations for what to do and see around the area. Definitely would recommend this house!
Jenny T|Apr 2024||Great stay!
Melvin C|Apr 2024||Amazing house I love it hopefully it’s free for my next trip to Clearwater
Denise M|Mar 2024||This was a great stay for a gathering of friends! Plenty of space for everybody and I like how the common spaces have multiple seating areas. We appreciated all the amenities, especially pool floats, laundry with detergent, basic cooking ingredients, and dishwasher detergent. I would stay here again!
John M|Mar 2024||We had a great stay. The house was perfect for our group. We were in town for two Phillies Spring Training games and the location is really perfect for that - a 2 minute drive or a 15 minute walk! The house is wonderful, we loved the pool and outdoor area, we made a short trip to Clearwater for dinner one night, and enjoyed takeout in the spacious dining area the other night.Sonya is an excellent host. She responded to every message within minutes, she provided excellent instructions, and sent a lovely guide to the house and the area that made our trip a breeze.Highly recommend!
Joe D|Mar 2024||I appreciate how responsive the owners were. We had a small issue that corrected itself, but the owners still had someone come out to make sure it was fine within a few hours on a Sunday. Everything was as described and we enjoyed our stay. Nothing more we could ask for. Thank you!
Patty F|Feb 2024||Sonya was so accommodating with our early arrival! So thankful for her flexibility!
Joey H|Feb 2024||We asked for an early checkin & Sonya worked with the cleaning crew to accommodate our request. She was very responsive to our concerns!
Jason M|Feb 2024||The home lived up to every expectation, and matched the description provided.
Randall P|Feb 2024||The place is beautiful and we want to come back! Home away from home!!
Brian S|Feb 2024||Thank you for accommodating! Very easy to work with!
Petrona L|Jan 2024||Part of my family visited Busch Gardens which it was 45 mins. away. Clearwater beach it’s pretty close by car. Maybe 15 mins away. We couldn’t ask for more. We really enjoyed this place, we used BBQ and pool. Very equipped house. My family and I loved this place. It was a short vacation but it was worth it!!
Hayley B|Dec 2023||Great place, super nice hosts.
Danielle M|Nov 2023||This house was incredible. The second we walked in the door my family felt as though our vacation had started!! We brought out children and grandchildren ( ages 4 months - 3 yrs ) and there was everything we needed and more. Honestly this is hands down the best Airbnb we have ever stayed in, and Juliana was incredible to deal with. It is close to Disney, and shopping and the clubhouse has all kinds of amenities. The house was immaculate and the beds we sooo comfortable. The attention to detail was incredible, we will definitely be back!
Hanifah S|Oct 2023||We had a wonderful stay at Sonya's house. It was very spacious for our group of 10 adults and in a convenient location close to lots of grocery stores and restaurants but tucked away on a quiet street. We were in town for a wedding so we picked a place that would be close to those events . But Clearwater Beach was also only about 15 minutes away. The house and decor were beautiful! The beds were comfortable and the everything was nice and clean. The home also had everything you need for your stay. The kitchen was stocked with every spice and gadget you'd need for cooking. There was plenty of seating inside and out. We used the grill and enjoyed swimming in the pool or just lounging in the screened in area. Sonya and Daksh were very responsive and got back to us quickly with any questions. I would definitely recommend.
Phillip W|Oct 2023||Great stay, would recommend
Rehema G|Oct 2023||We traveled with a 16u softball team with 12 players and this unit was exactly what we needed. Clean and everything in its place. I highly recommend it.
Claudia R|Sep 2023||Such a great experience. The house is beautiful like it looks in the pictures. The house is very clean, and spacious, has great style, and is super fun to go with family. We are glad we picked this home because it was very spacious and each person was able to have their room while also spending time together in the pool, and living room kitchen. I highly recommend staying here. Thanks to this great experience :)
James H|Sep 2023||5 stars!! House was amazing, our group of 10 had a fantastic time
Suvondal T|Sep 2023||Sleek and yet cozy! When I walked in I could smell how fresh and clean the house was. It was enough space for dining and watching tv. We had access to just about every streaming app you can think of. You can tell they put so much thought into giving the best family experience from the baby high chair to the small floaters in the pool area. One of my best Airbnb experiences. Would stay again.
Luke S|Sep 2023||Luxury decor - super clean - well appointed with everything needed for a 3-4 day stay.
Mike B|Aug 2023||This home was beautiful, lots of space, a great outdoor pool area, comfortable beds, spacious kitchen, dining and living area. Close to shopping, quick drive to the beach, Tampa and PIE airport. Exceeded our expectations and we will 100% be staying here again.
Laketa J|Aug 2023||Clean, nice home. My family enjoyed our stay and would return.
Nuraishah M|Jul 2023||Gorgeous home! Modern, clean, and cozy. Highly recommend!
Savana B|Jul 2023||Absolutely incredible listing. Amazing hosts and house. It is exactly like the pictures. Great safe area with restaurants and grocery stores close by. 10/10 best Airbnb experience I’ve ever had.
`

const OWL_AND_HARE = `
Kara B|Mar 2026||This was a great place to stay for two groups or families. We had a fantastic time and thoroughly enjoyed all the amenities onsite. Sonya was always quick to reply if we had any questions. Highly recommended
Nicholai H|Feb 2026||Loved it. Had a great time at our bachelor party here.Sauna, cold plunge, and pickleball especially unique amenities. Would come back for sure!
Monica F|Feb 2026||Owl & Hare in Joshua Tree was an absolute gem. This Airbnb is beautifully designed and thoughtfully appointed, with so many special amenities that it truly felt like our own private wellness retreat. The sauna, cold plunge, and infrared therapy created the perfect space to relax and reset.We especially loved the layout of the two separate homes—it gave each family their own privacy while still being close enough to feel connected and together. The location couldn’t have been better: just minutes from the park entrance yet conveniently close to Joshua Tree town.It’s a peaceful, elevated getaway that feels both luxurious and welcoming. We would absolutely stay here again.
Jessica C|Jan 2026||This property was incredible—beautiful, well-appointed, and thoughtfully set up for families. We stayed as two families with kids and dogs and couldn’t have asked for a better experience. One of the best features was having two separate houses on the shared property, which made it incredibly comfortable for two families with kids of different ages to stay together while still having plenty of space and privacy. The hosts were amazing, and the location was unbeatable, especially being so close to the park. Highly recommend—book it without hesitation!
Ricardo F|Jan 2026||We had a good stay overall and enjoyed the space. The property had a lot of nice amenities that everyone appreciated, and one of the best parts of the stay was the pickleball. It was a relaxing place to spend the weekend. The host was responsive and communication was smooth throughout our stay. Overall, it was an enjoyable stay and a solid place to visit in the area.
Cheryl S|Jan 2026||We had an amazing stay at Owl and Hare. Our family found everything quite comfortable and we enjoyed the sauna and pickleball court. It’s a great property with lots of amenities and we would gladly stay again if we are back in the area. The hosts are incredibly responsive and sent over firewood via instacart late one evening for us. This was above and beyond our expectations . A great stay and highly recommend !
Daniel O|Jan 2026||Amazing location, beautiful home, incredible amenities! What more could you want? Highly recommend.
Dustin L|Dec 2025||Excellent property and great communication
Devin M|Dec 2025||Loved this place. Lots do to on site, we did the sauna and cold plunge as well as sat by the fire pit making s’mores. Both houses are set up beautifully. Hare was our favorite but they both offered something different. Like having two options for each night staying there. It’s also right at the entrance to the national park and hiking areas. Would definitely stay here again.
Luis N|Dec 2025||Beautiful
Jessamin Y|Dec 2025||Loved this Airbnb! Booked this place for a lil getaway for the whole family, and everyone loved it, from adults to kids! space was clean, tons of amenities and overall very clean and well-kept. super beautiful area with a beautiful lodging to accompany it. the host was very responsive and nice. Defs recommend this place!
Jonathan J|Nov 2025||Joshua Tree is magical and the Owl&Hare is the perfect place to stay.
Kernan R|Oct 2025||Joshua Tree feels like a place slightly sideways from the rest of reality, an ancient garden of strange geometry and quiet intelligence. The house mirrored that feeling perfectly: two simple dwellings resting in the hush of open desert where silence has its own texture. Each evening the sun fractured into amber and violet over the rocks as coyotes began their strange chorus, half laughter, half lament, keeping watch over something older than time. By day, the park unfolded like a living textbook of evolution, its plants sculpted by patience and imagination. The location was close enough to feel the desert’s pulse, yet far enough to let stillness settle in. The wood-fired sauna under the stars felt like communion with the elements, with family, and with the dog asleep by the door. A quiet, extraordinary place that reminds you how alive the desert truly is.
Maysam S|Oct 2025||Majestic place with lots of activities. I love actives and my wife and friends like to chill. It was a perfect balance for both. Great vibes and very comfortable.
Marlene T|Oct 2025||The place was beautiful! So many things to do. Celebrated my bf’s 30th bday and Sonya sent a cake for us to celebrate. Very responsive and proactive! When I asked if they had a toaster, she ha one delivered. I’ve never had a host do that before. I loved it!
Sam B|Sep 2025||We loved staying at Sonya’s. It was peaceful and relaxing. I wanted to book a place that had a large lot with lots to explore and do, and this was great for that. Beautiful landscaping and lots of great features. Close to Joshua Tree National Park.
Soud A|Sep 2025||The place was amazing and Sonya was an incredible host
Chris A|Sep 2025||The Airbnb met our expectations! We initially booked it for all the entertainment it had to offer and we all definitely enjoyed everything! Everyone enjoyed themselves from the bonfire to the jacuzzi to the ping pong to the pool table and more! Both houses fit our needs. There was also great communication between us and the hosts.We do have to point out though for safety reasons that two people injured themselves opening the front door to the Hare house (the one without the pool table) due to it not opening properly and as a result, they bumped their knuckles on the sharp corner from door trim and ended up with a scrape. We highly suggest to fix the lock on the door or put smooth covers on the sharp corner trims. It would also be nice to provide some more lighting in the backyard. Also bbq didn’t work which we were looking forward to using. Besides these, overall it was a fun stay. Thank you for the chance to stay here and being so good at communicating. We really appreciate it.
Bora R|Sep 2025||The house and property are absolutely stunning! Great for families with kids, so much to do. Lots of shops and restaurants close by and the park is just a few minutes away. Communication with the hosts was easy and fast. Great place!
Christopher R|Sep 2025||Loved Sonya’s place. Very private and spacious and great amenities. Both units had a kitchen, bathrooms and bedrooms. Beautiful scenery. Sonya is also very responsive and attentive as a host, will definitely come back. Location is also not far from town.
Mayada A|Aug 2025||We had a great time here!! It was perfect for a group celebrating a birthday and the airbnb was huge and had so much to do. Sonya and Daksh were great and even sent over some birthday gifts during our stay! Would definitely book again!
Hanna R|Aug 2025||We absolutely loved it here! There was alot to do, the amenities were very nice. Everything was super clean and stocked. The atmosphere was so peaceful and the view was breathtaking. The host is very responsive and kind and we will definitely be coming back, 100/10 experience!
Gabriel D|Aug 2025||This was by far the best Airbnb we have ever stayed in.The property has two separate houses, each with its own fully equipped kitchen, which makes it perfect for groups traveling together. It gave us plenty of space to spread out while still being able to gather for meals and spend time together. There are so many things to do without even leaving the property — from ping pong and pickleball to the sauna, pool, and hot tub. The cold plunge was such a fun bonus, and we loved alternating between relaxing and staying active.The location was perfect, offering both peace and privacy while still being close enough to explore the area. Communication with the host was easy and friendly, and they made sure we had everything we needed for a perfect stay.We’ve stayed in many Airbnbs before, but this one set a whole new standard. It was an unforgettable experience, and we can’t wait to come back.
Georgina M|Aug 2025||We had the best quality time with our family here! There are so many activities to do in the property you don't have to go anywhere else. We will definitely be returning soon.
Mimi H|Aug 2025||Absolutely loved our stay at this Airbnb in Joshua Tree! The location couldn’t have been better -- just minutes from the park entrance, which made early morning hikes super convenient. The neighborhood was serene and peaceful, perfect for stargazing at night.The home was clean, beautifully decorated, perfect as described in the photos, and filled with thoughtful amenities that made our stay incredibly comfortable and fun. The bed was honestly one of the best we’ve ever slept in -- we didn’t want to get up! From the cozy outdoor seating area to the fully equipped kitchen, everything we needed was right there.This place was the perfect retreat for all of us. Both the adults and kids left as happy campers! Highly recommend to anyone visiting Joshua Tree -- we would definitely stay here again!
Tony P|Jul 2025||Great location with a cool view, loads of amenities/activities which is the highlight. Pickleball, bocce, ping pong, jacuzzi, cold plunge, sauna, they have you covered for whatever the weather may be. The two separate buildings are also convenient if someone wants to sleep while everyone else stays up. Communication and check-in/out were easy, would def recommend.
Kai C|Jul 2025||The best Airbnb we have ever stayed in! Even better than the photos. The place was immaculate and the host was super responsive. This is a place we will be coming back to and recommending to friends!
Julia W|Jul 2025||We had a wonderful stay! Beautiful property, especially enjoyed the pool and fire pit.
Tiffany H|Jul 2025||Cute place! Lots of fun things to do in the backyard 😊
Richard M|Jun 2025||Had a amazing time with the family. pool perfect size for the kids, AC worked great. enjoyed stargazing at night. Down the street from the NP
Raul V|Jun 2025||Great place love the pool and all the extra activities great view
Jeremy L|Jun 2025||What a great house, tons of activities. A great basecamp for the park. If its available, book it. Thanks again
`

const SIERRA_CREST_HAVEN = `
Riqiang H|Mar 2026||非常好的地方，值得来
`

const BY_SLUG: Record<string, Review[]> = {
  'casa-grande': parse('casa-grande', CASA_GRANDE),
  'owl-and-hare': parse('owl-and-hare', OWL_AND_HARE),
  'sierra-crest-haven': parse('sierra-crest-haven', SIERRA_CREST_HAVEN),
  // Broadleaf is new and has no reviews yet.
}

export function getStaticReviews(slug: string): Review[] {
  return BY_SLUG[slug] ?? []
}
