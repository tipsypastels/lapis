INSERT INTO Artifacts VALUES   (1001, "Invisibility Potion", "Makes your body invisible for 5 hours after drinking it. ", "Invisibility", "moderatelySafe", "2019-10-09 00:00:01");
INSERT INTO Artifacts VALUES   (1002, "Hypnotic Mirror", "Just a look into this mirror can hypnotize the person.", "Hypnotism", "dangerous", "2019-07-25 00:00:01");
INSERT INTO Artifacts VALUES   (1003, "Goblet of Fire", "Choose a champion of the Triwizard Tournament ", "Selection", "moderatelySafe", "1990-10-05 00:00:01");
INSERT INTO Artifacts VALUES   (1004, "Love Potion", "Give it to the person you like and let them drink it in front of you, they will fall in love with you.", "To get love from a person you desire.", "dangerous", "2017-08-08 00:00:01");
INSERT INTO Artifacts VALUES   (1005, "Pensieve", "Used to collect and view memories", "Storage and Recollections", "moderatelySafe", "1990-09-07 00:00:01");
INSERT INTO Artifacts VALUES   (1006, "Love Antidote", "Love Potion causing problems? Use this antidote to undo the effect of Love Potion.", "Undoes the effect of Love Potion", "safe", "2017-01-01 00:00:01");
INSERT INTO Artifacts VALUES (1007, "Anti-Aging Soap Bar", "Take a bath of a lifetime (literally!) because you won't age at all after that!", "Anti-Aging properties", "safe", "2011-12-25 00:00:01");
INSERT INTO Artifacts VALUES (1008, "Truth Perfume", "Liars Beware! Once you spray it, you can't hide the truth.", "Truth detector", "safe", "2016-11-02 00:00:01");
INSERT INTO Artifacts VALUES(1009, "Wish Ring", "You can make three wishes and no more.", "Fulfills wishes.", "safe", "2014-08-08 00:00:01");
INSERT INTO Artifacts VALUES(1010, "Sleeping Potion", "Forget all your worries and sleep!", "Helps in sleeping.", "safe", "2014-11-18 00:00:01");
INSERT INTO Artifacts VALUES(1011, "Feel Good Potion", "Ward off all the negative energies.", "Cleanses your aura.", "safe", "2014-07-21 00:00:01");
INSERT INTO Artifacts VALUES(1012, "Moon Amulet", "Keep calm and wear the amulet!", "Induces calmness.", "safe", "2014-02-11 00:00:01");
INSERT INTO Artifacts VALUES(1013, "Book of Spells", "We got all kinds of spells for you!", "miscellaneous", "moderatelySafe", "2014-02-11 00:00:01");
INSERT INTO Artifacts VALUES(1014, "Map of hidden treasures", "Go out and explore!", "miscellaneous", "safe", "2019-05-15 00:00:01");
INSERT INTO Artifacts VALUES(1015, "The void", "Your storage solution for all the magical stuff!", "Provides incredible space for storage.", "safe", "2013-04-06 00:00:01");
INSERT INTO Artifacts VALUES(1016, "Shield Amulet", "Throws away all the curses put on you.", "Shields the wearer.", "safe", "2013-10-10 00:00:01");
INSERT INTO Artifacts VALUES(1017, "The Antidote", "Makes every poison ineffective.", "Neutralizes poisons.", "safe", "2003-11-11 00:00:01");
INSERT INTO Artifacts VALUES(1018, "Crystal of Illusions", "Makes the seer lose their senses.", "Produces hallucinations.", "dangerous", "2014-12-07 00:00:01");
INSERT INTO Artifacts VALUES(1019, "Magic whistle", "Controls animals.", "Controls animals.", "moderatelySafe", "2010-01-14 00:00:01");
INSERT INTO Artifacts VALUES(1020, "Healing tea", "Your cure for everything.", "Improves health.", "safe", "2018-07-20 00:00:01");


INSERT INTO Experiments VALUES(2221, "Invisibility potion on living and non-living things,", "A potion can be consumed by living beings but how to use same potion for inanimate objects?", "2012-11-25 00:00:01", NULL, 1001);
INSERT INTO Experiments VALUES(2222, "Can a mirror be only used on humans?", "Related to consciousness which is obvious in humans compared to that in animals", "2013-11-25 00:00:01", "2015-11-25 00:00:01", 1002);
INSERT INTO Experiments VALUES(2223, "Testing Pensieve", "Testing the artifact and measuring the duration of memories stored", "2014-11-25 00:00:01", NULL, 1008);
INSERT INTO Experiments VALUES(2224, "Mirror mirror, what do you recall?", "Using hypnotic mirror to obtain memories that are present in mind subconsciously", "2015-11-25 00:00:01", "2015-12-25 00:00:01", 1005);
INSERT INTO Experiments VALUES(2225, "Getting the truth out of you.", "Its time to reveal the truth!", "2016-11-25 00:00:01", NULL, 1002);


INSERT INTO Ingredients VALUES(1111, "Glass Flower", "Austria", "Transparent", "Minty and Tangy", "common", "solid");
INSERT INTO Ingredients VALUES(1112, "Ammonia", "United States", "Transparent", "Decaying fish", "common", "liquid");
INSERT INTO Ingredients VALUES(1113, "Dragon Scales", "Taiwan", "Olive Green", "Flesh", "legendary", "solid");
INSERT INTO Ingredients VALUES(1114, "Rose", "England", "Pink", "Rosy", "common", "solid");
INSERT INTO Ingredients VALUES(1115, "Unicorn horn", "Scotland", "White", "Candy", "legendary", "solid");
INSERT INTO Ingredients VALUES(1116, "Vampire's Tooth", "Ukraine", "Black", "Bloody", "rare", "solid");
INSERT INTO Ingredients VALUES(1117, "Yew Tree root", "Canada", "Brown", "Earthy", "common", "solid");
INSERT INTO Ingredients VALUES(1118, "Toad Skeleton", "Bahrain", "White", "Smokey", "common", "solid");
INSERT INTO Ingredients VALUES(1119, "Skunk Hair", "Bolivia", "Black", "Rotten eggs", "common", "solid");
INSERT INTO Craftable VALUES(1010, "Add lavendar to brewing mint water. Add a pinch of moonstone sand. Put it in a bottle and spray it before going to bed.");
INSERT INTO Craftable VALUES(1011, "Add two cups of red wine in a cauldron and boil it with willow tree bark. Stir it clockwise and add seven cloves.");
INSERT INTO Craftable VALUES(1017, "Bring water to boil. Add Aconitum petals and leave it to boil for another 10 minutes. Add 2 mistletoe berries and leave it to cool down. Strain the mixture into a vial.");
INSERT INTO Craftable VALUES(1020, "Add witch hazel into rose water and simmer it in a cauldron. Add a teaspoon of honey and chamomile petals. Brew for 10 minutes and strain it for immediate consumption or store.");


INSERT INTO Users VALUES(1101, "Kira Fowler", "alchemist", '$2b$04$Y3Kajq.brUxubbZTON5V7u59tPmpORwSGQBiM3yPW6UwjZlT1fIeu');
INSERT INTO Users VALUES(1102, "Nathan Reed", "admin", '$2b$04$Y3Kajq.brUxubbZTON5V7u59tPmpORwSGQBiM3yPW6UwjZlT1fIeu');
INSERT INTO Users VALUES(1103, "Tristan Summers", "sorcerer", '$2b$04$Y3Kajq.brUxubbZTON5V7u59tPmpORwSGQBiM3yPW6UwjZlT1fIeu');
INSERT INTO Users VALUES(1104, "Crystal Lou", "thaumaturge", '$2b$04$Y3Kajq.brUxubbZTON5V7u59tPmpORwSGQBiM3yPW6UwjZlT1fIeu');
INSERT INTO Users VALUES(1105, "Omar Baird", "conjurer", '$2b$04$Y3Kajq.brUxubbZTON5V7u59tPmpORwSGQBiM3yPW6UwjZlT1fIeu');


INSERT INTO Craftable VALUES(1001, "Gently pluck the petals of Glass Flower and put them with a mixture of water and liquid ammonia and heat till the mixture starts bubbling. Add dragon scales and let it cool.");
INSERT INTO Craftable VALUES(1004, "Crush the petals of Rose and put into a cauldron. Add powdered Unicorn horn and wild berries with it. Brew with freshly fetched creek water till the colour turns red.");
INSERT INTO Craftable VALUES(1006, "To undo the love, add thorns, skunk hair, milky sap from weeping fig into mortar and crush them together.");
INSERT INTO Craftable VALUES(1007, "Add lye and oil together and heat them in a cauldron. Crush a vampire's tooth into the mixture. Add fresh clay from a river and add a 500 year old root of yew tree and sandalwood. Cool the mixture into cake form.");
INSERT INTO Craftable VALUES(1008, "On a full moon day, get the pulp of cow's tongue plant and add into it a spoonful of powdered toad skeleton. Add lavender for scent and brew it in water. Strain it after boiling.");
INSERT INTO Ingredients VALUES(1120, "Aconitum", "USA", "Purple", "No scent", "common", "solid");
INSERT INTO Ingredients VALUES(1121, "Moonstone sand", "Bulgaria", "White", "Soft talcum scent", "rare", "solid");
INSERT INTO Ingredients VALUES(1122, "Willow tree bark", "Canada", "Brown", "murky", "common", "solid");
INSERT INTO Ingredients VALUES(1123, "Silverweed", "Canada", "Yellow", "Pineapple", "common", "liquid");
INSERT INTO Ingredients VALUES(1124, "Myrrh resin", "Somalia", "Brown", "woody and pungent", "common", "solid");
INSERT INTO Ingredients VALUES(1125, "Passion fruit juice", "Colombia", "Yellow", "Fruity", "common", "liquid");
INSERT INTO Ingredients VALUES(1126, "Peacock feathers", "India", "Multicolored", "No scent", "rare", "solid");


INSERT INTO AuthoredBy VALUES(1001, 1101);
INSERT INTO AuthoredBy VALUES(1004, 1102);
INSERT INTO AuthoredBy VALUES(1006, 1104);
INSERT INTO AuthoredBy VALUES(1006, 1103);
INSERT INTO AuthoredBy VALUES(1007, 1104);
INSERT INTO AuthoredBy VALUES(1008, 1105);
INSERT INTO AuthoredBy VALUES(1009, 1105);
INSERT INTO AuthoredBy VALUES(1010, 1101);
INSERT INTO AuthoredBy VALUES(1006, 1105);
INSERT INTO AuthoredBy VALUES(1011, 1102);
INSERT INTO AuthoredBy VALUES(1012, 1101);
INSERT INTO AuthoredBy VALUES(1013, 1103);
INSERT INTO AuthoredBy VALUES(1014, 1104);
INSERT INTO AuthoredBy VALUES(1015, 1105);
INSERT INTO AuthoredBy VALUES(1006, 1102);
INSERT INTO AuthoredBy VALUES(1006, 1101);


INSERT INTO Run VALUES(1101, 2221);
INSERT INTO Run VALUES(1101, 2222);
INSERT INTO Run VALUES(1102, 2224);
INSERT INTO Run VALUES(1103, 2223);
INSERT INTO Run VALUES(1104, 2225);


-- INSERT INTO PerformedOn VALUES(1001, 2221, "2012-11-25 00:00:01", NULL);
-- INSERT INTO PerformedOn VALUES(1002, 2222, "2013-11-25 00:00:01", "2015-11-25 00:00:01");
-- INSERT INTO PerformedOn VALUES(1008, 2225, "2014-11-25 00:00:01", NULL);
-- INSERT INTO PerformedOn VALUES(1005, 2223, "2015-11-25 00:00:01", "2013-12-25 00:00:01");
-- INSERT INTO PerformedOn VALUES(1002, 2224, "2016-11-25 00:00:01", NULL);


INSERT INTO TestersHave VALUES(2221, "Andrew Jacobs", "2019-07-02 00:00:01", "778-256-7894", "1479 136 Street, Surrey, BC");
INSERT INTO TestersHave VALUES(2222, "Martha Rodriguez", "2019-10-09 00:00:01", "604-141-1245", "145 Avenue 186A Street, Burnaby, BC");
INSERT INTO TestersHave VALUES(2223, "Keith Rogers", "2017-06-05 00:00:01", "236-125-4503", "4567 146 Street, Surrey, BC");
INSERT INTO TestersHave VALUES(2224, "Madeleine Pesch", "2015-11-25 00:00:01", "778-645-1268", "125 Old Yale Road, Surrey, BC");
INSERT INTO TestersHave VALUES(2225, "Dax Swift", "2015-11-25 00:00:01", "236-895-9999", null);


INSERT INTO Containing VALUES(1001, 1111);
INSERT INTO Containing VALUES(1004, 1114);
INSERT INTO Containing VALUES(1006, 1119);
INSERT INTO Containing VALUES(1007, 1117);
INSERT INTO Containing VALUES(1008, 1118);
INSERT INTO Containing VALUES(1010, 1121);
INSERT INTO Containing VALUES(1011, 1122);
INSERT INTO Containing VALUES(1017, 1120);


INSERT INTO Similar VALUES(1001, 1008, "Liars Beware! Once you spray it, you can't hide the truth.");
INSERT INTO Similar VALUES(1002, 1008, "Liars Beware! Once you spray it, you can't hide the truth.");
INSERT INTO Similar VALUES(1003, 1007, "Take a bath of a lifetime (literally!) because you won't age at all after that!");
INSERT INTO Similar VALUES(1004, 1006, "Love Potion causing problems? Use this antidote to undo the effect of Love Potion.");
INSERT INTO Similar VALUES(1005, 1002, "Just a look into this mirror can hypnotize the person.");
INSERT INTO Similar VALUES(1011, 1010, "Forget all your worries and sleep!");
INSERT INTO Similar VALUES(1010, 1012, "Keep calm and wear the amulet!");
INSERT INTO Similar VALUES(1018, 1002, "Just a look into this mirror can hypnotize the person.");
INSERT INTO Similar VALUES(1015, 1005, "Used to collect and view memories");
