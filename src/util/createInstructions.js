/**
 * Generates the introduction for a song as a SpeechSynthesisUtterance object could read before the vocals start.
 *
 * @param {string} title - The title of the song.
 * @param {string} artist - The artist of the song.
 * @param {Array} upcoming - Array of upcoming tracks to mention.
 * @param {string} firstName - The name of the listener to mention.
 * @param {number} options - Options for what to include in the introduction.
 * @param {boolean} isNew - Whether the song is new and should be added to favorites.
 * @param {boolean} addedInfo - Additional information to include in the introduction.
 *
 * @return {Array} An array containing an object with the role of "user" and the content of the instructions.
 */
import { getRandomPoemType, isRandomlyTrue } from "./getRandomBoolean";
import { DJ_OPTIONS } from "./djOptions";
import { getLocation } from "./getLocation";
import moment from "moment";

const dotless = (str) => str?.replace(/\./g, "");

let ssmlProp = "";

if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
  // SpeechSynthesis API is supported
  var msg = new SpeechSynthesisUtterance();
  if ("SpeechSynthesisMarkupLanguage" in msg) {
    // SSML is supported
    console.log("This browser supports SSML");
    ssmlProp = "// format as SSML";
  } else {
    // SSML is not supported
    console.log("This browser does not support SSML");
  }
} else {
  // SpeechSynthesis API is not supported
  console.log("This browser does not support the SpeechSynthesis API");
}

export const createInstructions = async (
  title,
  artist,
  upcoming = [],
  firstName,
  options,
  isNew,
  addedInfo = false,
  lang = "en-US",
  dedicateName = false
) => {
  const nextUpcoming = upcoming
    .slice(0, 2)
    .map(
      ({ Title, artistName }) => `${dotless(Title)} by ${dotless(artistName)}`
    )
    .join(" and ");

  const weather = await getWeather();
  console.log({
    weather,
  });

  const shouldSayBoombot = options & DJ_OPTIONS.BOOMBOT;
  const shouldSayUsername = addedInfo && options & DJ_OPTIONS.USERNAME;
  const shouldSayTime = addedInfo && options & DJ_OPTIONS.TIME;
  const shouldSayUpnext = options & DJ_OPTIONS.UPNEXT;
  const shouldSayWeather = options & DJ_OPTIONS.WEATHER;

  const when = {
    poem: isRandomlyTrue(true) ? getRandomPoemType() : null,
    boom: isRandomlyTrue(shouldSayBoombot),
    time: isRandomlyTrue(shouldSayTime),
    next: isRandomlyTrue(shouldSayUpnext && !!nextUpcoming?.length),
    name: isRandomlyTrue(
      shouldSayUsername && firstName !== undefined && firstName !== "undefined"
    ),
    rain: isRandomlyTrue(shouldSayWeather && !!weather),
  };

  //  log positive conditions
  console.table(
    Object.keys(when).reduce((out, key) => {
      if (when[key]) {
        out[key] = when[key];
      }
      return out;
    }, {})
  );

  const instructions = `Write an introduction to the song "${dotless(
    title
  )}" by "${dotless(
    artist
  )}" that a SpeechSynthesisUtterance object could read before the vocals start.

      ${
        isNew
          ? "Remind user to add this song to favorites by clicking the pin icon."
          : ""
      }
      ${when.poem && `Format the introduction as a ${when.poem}.`}
      ${
        when.boom &&
        "If there is time the introduction should mention Sky-tunes Radio in the introduction."
      }
      ${
        when.time &&
        `If there is time the introduction should be topical to the time of day which is ${moment().format(
          "hh:mm a"
        )}.`
      }
      ${
        when.next &&
        `If there is time the introduction should mention the upcoming tracks: ${nextUpcoming}.`
      }
      ${
        when.name &&
        `If there is time the introduction should mention a listener named ${firstName}.`
      }
      ${
        when.rain &&
        `If there is time the introduction should mention the weather ${weatherText(
          weather
        )}.`
      }
      ${
        !!dedicateName &&
        `This song is dedication to listener "${dedicateName}"`
      }
      
      The listeners locale setting is "${lang}"

      Return the answer as an Intro in this format:
      
      interface Intro {
        Introduction: string; ${ssmlProp}
      }

      Do not declare a variable.
      Do not return the interface.
      It is important that the introduction should not take longer than it takes for the vocals to start, even if that means omitting information.

      Your response is intended to be parsed as JSON.`;

  const create = (content) => [
    {
      role: "system",
      content:
        "You are a very popular radio disc jockey with an irreverent sense of humor.",
    },
    { role: "user", content },
  ];
  return create(instructions);
};

export const createPlaylist = async (files, lang) => {
  const weather = await getWeather();

  const instructions = `
      Assume that the current time  is ${moment().format("hh:mm a")}.
      Assume that the  current weather is ${weatherText(weather)}. 
      Create a random playlist from these songs: ${JSON.stringify(files)}.
      Where possible the songs should be topical to the time of day OR to the weather. 
      The listeners locale setting is "${lang}"
      Important:  return an array of the indices of the selected songs only. Do not include the song titles are any other content.
      `;

  const create = (content) => [{ role: "user", content }];
  return create(instructions);
};

const weatherText = (weather) => {
  if (!weather) return "";
  const { current, location } = weather;
  const { humidity, condition, temp_f } = current;
  return `Condition "${condition.text}". Temperature: ${temp_f}. humidity: ${humidity}. listener location: ${location.name}`;
};

const getWeather = async () => {
  const { latitude, longitude } = await getLocation();
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f8e24f457bmshd76f59e164634c2p1dd272jsn3ce80fab7676",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  const response = await fetch(
    `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`,
    options
  );
  return await response.json();
};
