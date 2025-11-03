# AI-Learning-Lab
<br>
<div align="center">
    <a href="https://carolinabaptist.github.io/AI-Learning-Lab">Laboratório de Inteligênica Artificial</a>
</div>
<br>
<div align="justify">
A series of activities for teaching first year students aged 6 to 7 about Artificial Intelligence. It consists of a digital activity, <i>Talking to Machines</i>, and four tangible activities in the lab: <i>Privacy and AI</i>, <i>Robot Race</i>, <i>Teach Mário</i> and <i>Sort It Out</i>.
</div>

# Activity 1: Talking to Machines
<div align="justify">
The goal of this session is to introduce children to generative AI through virtual assistants and chatbots. In this activity, children interact with tools like Siri and ChatGPT by asking questions and creating stories, discovering that AI can generate meaningful and sometimes surprising responses. At the same time, they observe that AI is not perfect. It can misunderstand input or produce inaccurate information. This experience helps them reflect on both the capabilities and the limitations of generative AI.
</div>
<br>
<div align="justify">
<strong>Key concepts:</strong> Generative AI, AI limitations<br>
<strong>Material:</strong> Computer with Internet
</div>
<br>
You can talk directly to ChatGPT using the voice version available at  (https://chat.openai.com)

# Activity 2: Privacy and AI
<div align="justify">
This activity is designed to help children identify different spheres of privacy and reflect on the type of information they share with AI tools and the world. At the beginning of the session, we revisit the concept of AI and give examples of how it appears in everyday life. We also briefly introduce the idea of supervised learning. The main focus of this session is privacy, encouraging children to think critically about personal data, consent, and the implications of sharing information with intelligent systems.
</div>
<br>
<div align="justify">
<strong>Key concepts:</strong> Data privacy, AI in daily life, Supervised learning<br>
<strong>Material:</strong> Paper, Coloured pencils, Glue, Scissors, Computer with Internet, AI Learning Lab platform
</div>
<div align="justify">
All materials used and full alternative script are available in the folder <code>materials\privacy-and-ai</code>.
</div>
<br>
<div align="justify">
The activity is available in Portuguese, English and Hindi.
</div>
<br>
<div align="justify">
<strong>⚠️ Voice Disclaimer:</strong> The voice used in Activity 2 depends on your browser and computer settings. It may vary depending on the available voices and speech synthesis support in your system. As an alternative, the teacher can read the text aloud. This approach was chosen so that the activity can also be carried out offline, without depending on an internet connection.
</div>

# Activity 3: Robot Race
<div align="justify">
In this activity, children are given a race track and small robots. Their challenge is to build the fastest path to win the race using puzzle pieces. The robot acts as an agent that makes decisions and interacts with its environment (the race track). The puzzle pieces form a set of predefined instructions that guide the robot's behavior.
</div>

<div align="justify">
As children place different puzzle pieces on the track, the robot responds with immediate feedback. For example, blue pieces make the robot move faster, while red pieces slow it down. Through trial and error, children learn how to improve their strategy by observing outcomes and adjusting their choices. They discover that to create the fastest path, they must maximize rewards, introducing them to the basic logic behind reinforcement learning.
</div>
<br>
<div align="justify">
To play, you should prepare the tracks in advance and place the question marks in empty spaces between two puzzle pieces, so that the children can fit the pieces and discover which one is the fastest. A photo showing an example of the track setup can be found in the <code>materials\robot-race</code> folder. To update the scoreboard, press 1 to give a point to team/player 1 and press 2 to give a point to player 2. There are currently 3 rounds. In addition, to proceed to the final explanation, press the End button and then click Continue until you reach the end.
</div>
<br>
<div align="justify">
The activity is available in Portuguese, Hindi and English.
</div>
<br>
<div align="justify">
<strong>Key concepts:</strong> Reinforcement Learning, Feedback, Reward, Penalty, Agent, Ambient, Algorithm<br>
<strong>Material:</strong> Race Track, Puzzles, Ozobots, Computer with internet, AI learning Lab, paper question marks
</div>
<br>
<div align="justify">
<strong>🧩 Alternative Version:</strong> Replace the programmable puzzles or Ozobots with colored cards and simple pawns on a paper track. Each color represents a specific number of spaces the pawn can move, but children don’t know this at the start. In each round, the children choose a combination of cards and move their pawn according to the total number of spaces those colors represent. After each test, they discuss and infer how each color might affect the movement, gradually discovering the hidden rule. The pawn that reaches the farthest position in a round is the winner.
</div>
<br>
<div align="justify">
<strong>⚠️ Voice Disclaimer:</strong> The voice used in Activity 2 depends on your browser and computer settings. It may vary depending on the available voices and speech synthesis support in your system. As an alternative, the teacher can read the text aloud. This approach was chosen so that the activity can also be carried out offline, without depending on an internet connection.
</div>
<br>
<div align="justify">
All materials used, track configuration and full alternative script are available in the folder <code>materials\robot-race</code>. 
</div>

# Activity 4: Teach, Mário!
<div align="justify">
In this activity, children teach a machine learning model to control a Mario character by creating custom input classes such as "right" and "up". Using a webcam, they take multiple photos to represent each class. Each hand gesture and glove color corresponds to a different movement in the game. With the collected data, the children train a classification model and then test it using the webcam to see if it correctly recognizes the gestures. Once the model is validated, it is exported and integrated into a Mario game, allowing the children to play by moving Mario with colored gloves, using their own trained model.
</div>
<br>
<div align="justify">
To play the game, use <a href="https://teachablemachine.withgoogle.com/train/image">Google Teachable Machine</a> to take the photos, create the labels right, up right and still, test the model and download the files. 
For the photos:<br>
• For “right”, the child should raise their right hand.<br>
• For “up right”, the child should raise their left hand.<br>
• For “still”, the child should keep both hands down.
<br>
In portuguese, the labels must be direita (right), cima direita (up right) and nada (still). When creating the Hindi version, use the following labels: दायाँ (right), ऊपर दायाँ (up right), and स्थिर (still).
</div>
<br>
After exporting the model, Google Teachable Machine provides a ZIP file containing all necessary files. You must unzip this file before uploading the model to the Lab, otherwise the platform will not recognize it correctly. This activity is the only one
that relies on internet.
<br>
<div align="justify">
<strong>Key concepts:</strong> Classification, Training data, Labels, Training, Supervised learning, AI models, Evaluation<br>
<strong>Materials:</strong> pairs of gloves of different colours, google teachable machine, ai learning lab
</div>

# Activity 5: Sort It Out
<div align="justify">
The goal of this game is to correctly group animals based on shared characteristics. On the table, there is a board with three circles on each side and a set of cards featuring animal images. The game begins when a participant presses a button to randomly select a grouping criterion, which is displayed on the computer screen. Example criteria include type of diet, main mode of locomotion, and number of legs. The children are then given time to organize the cards into clusters according to the selected criterion. Through this activity, they explore how to identify patterns and group data without being told the exact rules, an intuitive introduction to unsupervised learning and clustering.
</div>
<br>
<div align="justify">
<strong>Key concepts:</strong> Unsupervised learning, Clustering, Pattern recognition<br>
<strong>Materials:</strong> 1 game board, set of animal image cards and category cards to name clusters, computer with internet, ai learning lab, button
</div>
