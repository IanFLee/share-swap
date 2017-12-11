/* Main JS file for Share Swap. Written by Ian Lee from 11/26/17 */
// mdl refers to material design lite, doc refers to the document object. See jigsaw.js


// pseudo listings
var listings = [{
  location: 'Michigan',
  type: 'Mansion',
  description: 'Former home of the late Billy Mays. But wait, there\'s more!',
  imgURLs: ['http://homesoftherich.net/wp-content/uploads/2013/05/Screen-shot-2013-05-31-at-12.51.22-AM.png', 'http://homesoftherich.net/wp-content/uploads/2013/05/Screen-shot-2013-05-31-at-12.53.43-AM.png']
}, {
  location: 'California',
  type: 'Cabin',
  description: 'This is a great square building. It smells like pine trees. You\'ll be sharing the cabin with three bears (they\'re electrical engineers) and a bald eagle (retired)',
  imgURLs: ['https://uncrate.com/p/2015/07/lb-cabin-1.jpg', 'https://www.boutique-homes.com/wp-content/uploads/vacation-rentals/americas/united-states/glass-cabin-laconner-washington/modern_vacation_rentals_laconner_washington_011.jpg', 'https://cdn.gardenista.com/wp-content/uploads/2015/04/fields/creekside%20cabin%20amy%20alper%202.png']
}, {
  location: 'Virginia',
  type: 'Villa',
  description: 'Nice villa in Virginia. A block away from the maple syrup factory.',
  imgURLs: ['http://www.goluxuryvillas.com/asset/images/destinations/vietnam/villarentals.jpg', 'http://www.hometrendesign.com/wp-content/uploads/2014/05/Beautiful-Landscape-Garden-with-Large-Green-Lawn-Guz-Fish-House.jpg']
}, {
  location: 'Tennessee',
  type: 'Tipi',
  description: 'A perfect place to stay if you love the great outdoors.',
  imgURLs: ['https://i.pinimg.com/236x/a4/a3/f5/a4a3f54ad8fddb495acf3ec8e7ebf578--teepee-camping-glamping.jpg', 'https://s-media-cache-ak0.pinimg.com/originals/19/f7/df/19f7df35140d8de234992ef72fda1d3f.jpg', 'https://a0.muscache.com/im/pictures/617325dc-bf3f-4691-98a3-32e75599d79f.jpg?aki_policy=x_large']
}];
// pseudo messages
var messages = [
  {
    subj: 'Your Arkansas Apartment',
    body: 'I would like to trade timeshares with you. My share is a house in Hawaii. It has four bedrooms and six dining rooms and a dozen watercolor paintings of Jim Belushi and one bathroom with a gold fountain in it.',
    link: '<link goes here>'
  },
  {
    subj: 'Yeti sightings in the area?',
    body: "Hi, is your apartment share a summertime share or a winter share? If it's in the winter, have you heard of any yeti sightings in the area? My wife and I saw the chupacabra once in Mexico and ever since then have dedicated our lives to the documentation of this majestic creature and its natural habitat. Speaking of majestic creatures, did you know that most beavers will live up to 125 years old? I had an Aunt Phyllis who was almost that old when she moved in with her daughter, who just got promoted at work, and boy am I ever jealous! I've been vying for a promotion for years now! Maybe I should hang out by the water cooler more often.",
    link: '<link goes here>'
  },
  {
    subj: 'Chain email',
    body: 'If you forward this email to 25 people, you will win the lottery on the next Friday the 27th, but if you don\'t, you will get a nasty case of chicken pox',
    link: '<link goes here>'
  }
];

var details = {
  user : 'user',
  pass : 'pass',
  myShare : {
    location : 'Arkansas',
    type : 'Apartment',
    description : '<Add your description here>',
    imgURLs : []
  },
  listings : listings,
  messages : messages
};
// CLEAR LOCALSTORAGE ANYTIE A CHANGE IS MADE TO THE FORMAT
localStorage.clear();
if (!localStorage.getItem('details')) {
  localStorage.setItem('details', JSON.stringify(details));
}
