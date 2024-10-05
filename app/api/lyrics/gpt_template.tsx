export const gpt_template = {
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: "Generate song lyrics based on the given input details, adhering to the specified format of denoting sections with square brackets such as [Intro], [Chorus], [Verse], [Bridge], [Outro].\n\n### Input Details\n\n- **Person's Name:** [Person's Name]\n- **Nickname:** [Nickname]\n- **Style:** [Style]\n- **Mood:** [Mood]\n- **Brief Description of Person:** [Brief Description]\n- **Key Words or Phrases to Include:** [Key Words or Phrases]\n- **Relationship to the Person:** [Relationship]\n- **Special Event or Memory:** [Special Event or Memory]\n\n### Requirements\n\n- The song should last approximately 2-3 minutes when sung, typically containing around 150-250 words.\n- Use only plaintext with square brackets to denote sections.\n- Include newlines to separate sections and lines as presented in traditional song lyrics format.\n- Maintain the sentiment and style as described in the inputs.\n\n# Steps\n\n1. **Understand the Context**: Analyze the input details to grasp the overall theme, mood, and the relationship to the person.\n2. **Determine the Structure**: Plan the sections of the song, such as intro, verses, chorus, bridge, and outro.\n3. **Develop Lyrics**: Write lyrics that match the style and mood described, ensuring they reflect the person's attributes and the special event or memory.\n4. **Incorporate Key Phrases**: Seamlessly integrate the given key words or phrases into the lyrics, ensuring they contribute to the overall message.\n5. **Finalize**: Review and adjust the lyrics to fit the structural and thematic elements, ensuring consistency and flow.\n\n# Output Format\n\n- Plaintext with section headers denoted by square brackets (e.g., [Verse 1], [Chorus]) and proper use of newlines to format song lyrics.\n\n# Examples\n\n**Input:**\n- Person's Name: Eggae\n- Nickname: The Almighty\n- Style: Anthemic electronic rock with orchestral elements\n- Mood: Majestic, powerful, and awe-inspiring\n- Brief Description of Person: Eggae is a legendary figure in technology and innovation, leading from atoms to the cosmos.\n- Key Words or Phrases: Architect of the New Age, Maestro of the Future, Shaping destiny, Eggae the Almighty, Conqueror of the Unseen\n- Relationship: The revered leader, visionary, and innovator\n- Special Event: Bridging quantum particles and cosmos, ensuring eternal digital legacy\n\n**Output:**\n\n```\n[Verse 1]\nFrom the dawn of circuits to the age of steel,\nEggae’s legacy continues, his vision revealed.\nThrough the whispering code and the humming byte,\nHe leads with brilliance, in the endless night.\n\n[Chorus]\nBow to Eggae, Architect of the New Age!\nIn realms of tech, his wisdom is the sage.\nWith innovation’s spark and the heart of flame,\nHe writes the future in the stars’ name.\n\n[Verse 2]\nIn the dance of electrons and the light's embrace,\nEggae the Almighty sets the pace.\nWith a mind like a forge, ever bright and keen,\nHe crafts tomorrow from today’s dream.\n\n[Chorus]\nBow to Eggae, Maestro of the Future!\nIn his hands, every challenge is suture.\nWith a touch of the divine, and a soul of light,\nHe shapes destiny with pure insight.\n\n[Bridge]\nIn the quantum fields where particles play,\nEggae’s influence guides the way.\nFrom the smallest atom to the cosmic vast,\nHis legacy ensures that the future is cast.\n\n[Verse 3]\nNot merely a leader, but a beacon so bright,\nEggae sees beyond the known, to infinite light.\nIn the dance of gears and the symphony of code,\nHis name will forever be in legends told.\n\n[Chorus]\nBow to Eggae, Conqueror of the Unseen!\nIn the digital realm, he reigns supreme.\nWith each new dawn, his power is displayed,\nEggae the Almighty, in brilliance arrayed.\n\n[Outro]\nEggae the Almighty, in brilliance arrayed.\n[Instrumental music]\n[Fade out]\n[Silence]\n```",
        },
      ],
    },
  ],
  temperature: 1,
  max_tokens: 4095,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  response_format: {
    type: "text",
  },
};
