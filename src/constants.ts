import { Book, Chapter, Theme } from './types';

export const THEMES: Record<Theme, Record<string, string>> = {
  light: {
    '--bg': '#FAF6EF',
    '--ink': '#2C1E0F',
    '--accent': '#C8922A',
    '--accent-hover': '#B07D1F',
    '--accent-muted': 'rgba(200, 146, 42, 0.1)',
    '--border': 'rgba(44, 30, 15, 0.1)',
    '--highlight-yellow': 'rgba(255, 255, 0, 0.3)',
    '--highlight-amber': 'rgba(255, 191, 0, 0.3)',
    '--highlight-green': 'rgba(0, 255, 0, 0.3)',
    '--highlight-pink': 'rgba(255, 192, 203, 0.3)',
    '--highlight-purple': 'rgba(128, 0, 128, 0.3)',
  },
  dark: {
    '--bg': '#0D0B08',
    '--ink': '#F5ECD7',
    '--accent': '#C8922A',
    '--accent-hover': '#B07D1F',
    '--accent-muted': 'rgba(200, 146, 42, 0.2)',
    '--border': 'rgba(245, 236, 215, 0.1)',
    '--highlight-yellow': 'rgba(255, 255, 0, 0.2)',
    '--highlight-amber': 'rgba(255, 191, 0, 0.2)',
    '--highlight-green': 'rgba(0, 255, 0, 0.2)',
    '--highlight-pink': 'rgba(255, 192, 203, 0.2)',
    '--highlight-purple': 'rgba(128, 0, 128, 0.2)',
  },
  sepia: {
    '--bg': '#F4ECD8',
    '--ink': '#5B4636',
    '--accent': '#9B2335',
    '--accent-hover': '#7A1C2A',
    '--accent-muted': 'rgba(155, 35, 53, 0.1)',
    '--border': 'rgba(91, 70, 54, 0.1)',
    '--highlight-yellow': 'rgba(255, 255, 0, 0.3)',
    '--highlight-amber': 'rgba(255, 191, 0, 0.3)',
    '--highlight-green': 'rgba(0, 255, 0, 0.3)',
    '--highlight-pink': 'rgba(255, 192, 203, 0.3)',
    '--highlight-purple': 'rgba(128, 0, 128, 0.3)',
  },
  night: {
    '--bg': '#000000',
    '--ink': '#A0A0A0',
    '--accent': '#9B2335',
    '--accent-hover': '#7A1C2A',
    '--accent-muted': 'rgba(155, 35, 53, 0.2)',
    '--border': 'rgba(160, 160, 160, 0.1)',
    '--highlight-yellow': 'rgba(255, 255, 0, 0.15)',
    '--highlight-amber': 'rgba(255, 191, 0, 0.15)',
    '--highlight-green': 'rgba(0, 255, 0, 0.15)',
    '--highlight-pink': 'rgba(255, 192, 203, 0.15)',
    '--highlight-purple': 'rgba(128, 0, 128, 0.15)',
  },
};

export const SAMPLE_BOOK: Book = {
  id: 'meditations-marcus-aurelius',
  title: 'Meditations',
  author: 'Marcus Aurelius',
  coverUrl: 'https://picsum.photos/seed/meditations/400/600',
  progress: 0,
  isSample: true,
  content: [
    {
      id: 'book-1',
      title: 'Book I',
      content: `
        <p>1. From my grandfather Verus I learned good morals and the government of my temper.</p>
        <p>2. From the reputation and memory of my father, modesty and a manly character.</p>
        <p>3. From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.</p>
        <p>4. From my great-grandfather, not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.</p>
        <p>5. From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.</p>
        <p>6. From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of demons and such things; and not to breed quails for fighting, nor to give myself up to passionate devotion to such things; and to endure freedom of speech; and to have become intimate with philosophy; and to have been a hearer, first of Bacchius, then of Tandasis and Marcianus; and to have written dialogues in my youth; and to have desired a plank bed and skin, and whatever else of the kind belongs to the Grecian discipline.</p>
        <p>7. From Rusticus I received the impression that my character required improvement and discipline; and from him I learned not to be led astray to sophistic emulation, nor to writing on speculative matters, nor to delivering little hortatory orations, nor to showing myself off as a man who practises much discipline, or does benevolent acts in order to make a display; and to abstain from rhetoric, and poetry, and fine writing; and not to walk about the house in my outdoor dress, nor to do other things of the kind; and to write my letters with simplicity, like the letter which Rusticus wrote from Sinuessa to my mother; and with respect to those who have offended me by words, or done me wrong, to be easily disposed to be pacified and reconciled, as soon as they have shown a readiness to be reconciled; and to read carefully, and not to be satisfied with a superficial view of a thing, nor hastily to give my assent to those who talk overmuch; and I am indebted to him for being acquainted with the discourses of Epictetus, which he communicated to me from his own collection.</p>
      `,
    },
    {
      id: 'book-2',
      title: 'Book II',
      content: `
        <p>1. Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and of the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him. For we are made for co-operation, like feet, like hands, like eyelids, like the rows of the upper and lower teeth. To act against one another then is contrary to nature; and it is acting against one another to be vexed and to turn away.</p>
        <p>2. Whatever this is that I am, it is a little flesh and breath, and the ruling part. Throw away thy books; no longer distract thyself: it is not allowed. But as if thou wast now dying, despise the flesh; it is blood and bones and a network, a contexture of nerves, veins, and arteries. See the breath also, what kind of a thing it is, air, and not always the same, but every moment sent out and again sucked in. The third then is the ruling part: consider thus: Thou art an old man; no longer let this be a slave, no longer be pulled by the strings like a puppet to unsocial movements, no longer be either dissatisfied with thy present lot, or shrink from the future.</p>
        <p>3. All that is from the gods is full of Providence. That which is from fortune is not separated from nature or without an interweaving and involution with the things which are ordered by Providence. From thence all things flow; and there is besides necessity, and that which is for the advantage of the whole universe, of which thou art a part. But that is good for every part of nature which the nature of the whole brings, and what serves to maintain this nature. Now the universe is preserved, as by the changes of the elements so by the changes of things compounded of them. Let these principles be enough for thee, let them always be fixed opinions. But cast away the thirst after books, that thou mayest not die murmuring, but cheerfully, truly, and from thy heart thankful to the gods.</p>
      `,
    },
    {
      id: 'book-3',
      title: 'Book III',
      content: `
        <p>1. We ought to consider not only that our life is daily wasting away and a smaller part of it is left, but another thing also must be taken into the account, that if a man should live longer, it is quite uncertain whether the understanding will still continue sufficient for the comprehension of things, and retain the power of contemplation which strives to acquire the knowledge of the divine and the human. For if he shall begin to fall into dotage, perspiring and nutrition and imagination and appetite, and whatever else there is of the kind, will not fail; but the power of making use of ourselves, and filling up the measure of our duty, and clearly separating all appearances, and considering whether a man should now depart from life, and whatever else of the kind absolutely requires a disciplined reason, all this is already extinguished. We must make haste then, not only because we are daily nearer to death, but also because the conception of things and the understanding of them cease first.</p>
        <p>2. We ought to observe also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive. For instance, when bread is baked some parts are split at the surface, and these parts which thus open, and have a certain fashion contrary to the purpose of the baker's art, are beautiful in a manner, and in a peculiar way excite a desire for eating. And again, figs, when they are quite ripe, gape open; and in the ripe olives the very circumstance of their being near to rottenness adds a peculiar beauty to the fruit. And the ears of corn bending down, and the lion's eyebrows, and the foam which flows from the mouth of wild boars, and many other things—though they are far from being beautiful, if a man should examine them severally—still, because they follow the things which are formed by nature, they ornament them, and they please the mind; so that if a man should have a feeling and deeper understanding with respect to the things which are produced in the universe, there is hardly one of those which follow by way of consequence which will not seem to him to be in a manner disposed so as to give pleasure. And so he will see even the real gaping jaws of wild beasts with no less pleasure than those which painters and sculptors show by imitation; and in an old woman and an old man he will be able to see a certain maturity and comeliness; and the attractive loveliness of young persons he will be able to look on with chaste eyes; and many such things will present themselves, not pleasing to every man, but to him only who has become truly familiar with nature and her works.</p>
      `,
    },
  ],
};
