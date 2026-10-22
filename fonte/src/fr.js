module.exports = [
/* ---------- 2 ---------- */
{
  title:"D'où viens-tu ?",
  goal:"Dizer a nacionalidade e o país de alguém, e onde a pessoa mora.",
  speakers:{"Claire":"f","Lucas":"m"},
  setting:"Na escola de francês em Lyon, Claire apresenta os colegas de turma para o Lucas.",
  lines:[
    ["Lucas","Qui est-ce ?","Quem é?"],
    ["Claire","C'est Marta. Elle est espagnole. Elle vient de Madrid.","É a Marta. Ela é espanhola. Vem de Madri."],
    ["Lucas","Et lui ?","E ele?"],
    ["Claire","C'est Ken. Il est japonais. Il habite à Tokyo.","É o Ken. Ele é japonês. Mora em Tóquio."],
    ["Lucas","Ils sont étudiants ?","Eles são estudantes?"],
    ["Claire","Oui, nous sommes tous dans la même classe.","Sim, estamos todos na mesma turma."],
    ["Lucas","Et le professeur ?","E o professor?"],
    ["Claire","Il s'appelle Marc. Il est canadien. Il vient du Québec.","Ele se chama Marc. É canadense. Vem de Quebec."],
    ["Lucas","Ah, il parle français et anglais !","Ah, ele fala francês e inglês!"],
    ["Claire","Oui, mais il habite en France maintenant.","Sim, mas agora ele mora na França."]
  ],
  grammar:[
    {h:"O verbo être completo",
     p:["<b>je suis</b>, <b>tu es</b>, <b>il est</b>, <b>elle est</b>, <b>on est</b>, <b>nous sommes</b>, <b>vous êtes</b>, <b>ils sont</b>, <b>elles sont</b>.","<b>Ils</b> serve para grupo só de homens ou misto. <b>Elles</b> é só para grupo de mulheres."],
     ex:[["Nous sommes étudiants.","Nós somos estudantes."],["Vous êtes français ?","Vocês são franceses?"],["Ils sont japonais.","Eles são japoneses."]]},
    {h:"Nacionalidade: masculino e feminino",
     p:["Em geral, o feminino ganha <b>-e</b>: japonais → <b>japonaise</b>, espagnol → <b>espagnole</b>. Algumas dobram a consoante: canadien → <b>canadienne</b>. O plural ganha <b>-s</b>, menos quando já termina em s: <b>ils sont japonais</b>."],
     ex:[["Il est japonais.","Ele é japonês."],["Elle est japonaise.","Ela é japonesa."],["Elles sont canadiennes.","Elas são canadenses."]],
     tip:"Como em português, a nacionalidade é escrita com letra minúscula: <b>il est français</b>."},
    {h:"Em, no, na: países e cidades",
     p:["Países femininos (a maioria termina em -e) usam <b>en</b>: <b>en France</b>, <b>en Espagne</b>. Masculinos usam <b>au</b>: <b>au Brésil</b>, <b>au Canada</b>, <b>au Japon</b>. Plurais usam <b>aux</b>: <b>aux États-Unis</b>. Cidades usam <b>à</b>: <b>à Paris</b>."],
     ex:[["J'habite au Brésil.","Moro no Brasil."],["Elle habite en France.","Ela mora na França."],["Il habite à Tokyo.","Ele mora em Tóquio."]],
     tip:"<b>Le Mexique</b> termina em -e, mas é masculino: <b>au Mexique</b>."},
    {h:"Venir de: de onde a pessoa vem",
     p:["<b>je viens</b>, <b>tu viens</b>, <b>il vient</b>. Com países: <b>de France</b> (feminino), <b>du Brésil</b> (de + le), <b>des États-Unis</b> (de + les). Com cidades: <b>de Lyon</b>."],
     ex:[["Je viens du Brésil.","Venho do Brasil."],["Il vient des États-Unis.","Ele vem dos Estados Unidos."]]}
  ],
  vocab:[
    {h:"Países",items:[["la France","a França"],["le Brésil","o Brasil"],["le Canada","o Canadá"],["le Japon","o Japão"],["l'Espagne","a Espanha"],["le Portugal","Portugal"],["les États-Unis","os Estados Unidos"],["le Mexique","o México"]]},
    {h:"Nacionalidades",items:[["espagnol, espagnole","espanhol, espanhola"],["japonais, japonaise","japonês, japonesa"],["canadien, canadienne","canadense"],["américain, américaine","americano, americana"],["mexicain, mexicaine","mexicano, mexicana"],["portugais, portugaise","português, portuguesa"]]}
  ],
  pron:[
    {h:"O feminino acorda a consoante",p:"No masculino, a consoante final é muda: <b>japonais</b> soa “japoné”. No feminino, ela aparece: <b>japonaise</b> soa “japonéz”.",w:["japonais","japonaise","américain","américaine"]},
    {h:"Liaison",p:"Quando a palavra seguinte começa com vogal, a consoante muda pode se ligar a ela: <b>vous_êtes</b> soa “vuzét”.",w:["vous êtes","ils habitent","nous sommes"]},
    {h:"Qui est-ce ?",p:"Soa como uma palavra só: “ki-ÉS”.",w:["Qui est-ce ?"]}
  ],
  mc:[
    {q:"De onde a Marta vem?",o:["Madrid","Tokyo","Lyon"],a:0,e:"Elle vient de Madrid."},
    {q:"Onde o Ken mora?",o:["Paris","Tokyo","Québec"],a:1,e:"Il habite à Tokyo."},
    {q:"Como dizer “Moro no Brasil”?",o:["J'habite en Brésil.","J'habite au Brésil."],a:1,e:"Le Brésil é masculino: au."},
    {q:"Como dizer “Ela é japonesa”?",o:["Elle est japonais.","Elle est japonaise."],a:1,e:"No feminino, acrescente -e."}
  ],
  gaps:[
    {s:"Nous ___ étudiants.",a:["sommes"],h:"Nós somos estudantes."},
    {s:"Vous ___ français ?",a:["êtes"],h:"Vocês são franceses?"},
    {s:"J'habite ___ France.",a:["en"],h:"Moro na França."},
    {s:"Il habite ___ Canada.",a:["au"],h:"Ele mora no Canadá."},
    {s:"Ils ___ japonais.",a:["sont"],h:"Eles são japoneses."}
  ],
  order:[
    {t:["Elle","est","espagnole."],h:"Ela é espanhola."},
    {t:["J'habite","au","Brésil."],h:"Moro no Brasil."},
    {t:["Nous","sommes","dans","la","même","classe."],h:"Estamos na mesma turma."}
  ],
  dict:[{t:"Il est japonais."},{t:"Elle est japonaise."},{t:"J'habite au Brésil."},{t:"Vous êtes français ?"},{t:"les États-Unis"}],
  shadow:["Qui est-ce ?","C'est Marta. Elle est espagnole.","Il est canadien. Il vient du Québec.","Il habite en France maintenant."],
  write:{task:"Apresente 3 pessoas em francês: o nome, a nacionalidade e onde moram.",ph:"Carla est brésilienne. Elle habite à …"},
  cards:[
    ["Quem é?","Qui est-ce ?"],["Ela é espanhola.","Elle est espagnole."],["Ele mora em Tóquio.","Il habite à Tokyo."],
    ["Moro no Brasil.","J'habite au Brésil."],["Nós somos estudantes.","Nous sommes étudiants."],["Vocês são franceses?","Vous êtes français ?"],
    ["Ele vem dos Estados Unidos.","Il vient des États-Unis."],["Ela mora na França.","Elle habite en France."]
  ]
},
/* ---------- 3 ---------- */
{
  title:"Questions",
  goal:"Fazer e responder perguntas sobre dados pessoais, dizer a idade e negar.",
  speakers:{"Inès":"f","Lucas":"m"},
  setting:"Lucas se inscreve numa academia em Lyon. Inès, a recepcionista, preenche a ficha.",
  lines:[
    ["Inès","Bonjour ! Vous êtes nouveau ici ?","Bom dia! O senhor é novo aqui?"],
    ["Lucas","Oui. Je voudrais m'inscrire.","Sim. Eu queria me inscrever."],
    ["Inès","D'accord. Quel est votre nom ?","Certo. Qual é o seu nome?"],
    ["Lucas","Lucas Silva.","Lucas Silva."],
    ["Inès","Vous avez quel âge ?","Quantos anos o senhor tem?"],
    ["Lucas","J'ai vingt-cinq ans.","Tenho vinte e cinco anos."],
    ["Inès","Est-ce que vous êtes étudiant ?","O senhor é estudante?"],
    ["Lucas","Non, je ne suis pas étudiant. Je travaille.","Não, não sou estudante. Eu trabalho."],
    ["Inès","Vous avez un numéro de téléphone ?","O senhor tem um número de telefone?"],
    ["Lucas","Oui : zéro six, douze, trente-quatre, cinquante-six, quarante-huit.","Sim: zero seis, doze, trinta e quatro, cinquenta e seis, quarenta e oito."],
    ["Inès","Parfait, merci !","Perfeito, obrigada!"]
  ],
  grammar:[
    {h:"O verbo avoir",
     p:["<b>j'ai</b>, <b>tu as</b>, <b>il a</b>, <b>elle a</b>, <b>nous avons</b>, <b>vous avez</b>, <b>ils ont</b>. É o “ter”."],
     ex:[["J'ai un téléphone.","Tenho um telefone."],["Ils ont deux enfants.","Eles têm dois filhos."]]},
    {h:"Idade com avoir",
     p:["Como em português, a idade usa “ter”: <b>J'ai 25 ans</b>. A pergunta: <b>Tu as quel âge ?</b> ou <b>Vous avez quel âge ?</b>"],
     ex:[["J'ai vingt-cinq ans.","Tenho vinte e cinco anos."],["Elle a trente ans.","Ela tem trinta anos."]],
     tip:"A palavra <b>ans</b> é obrigatória: “J'ai vingt-cinq” sozinho fica incompleto."},
    {h:"Negação: ne… pas",
     p:["A negação abraça o verbo: <b>je ne suis pas</b>, <b>il ne travaille pas</b>. Antes de vogal, <b>ne</b> vira <b>n'</b>: <b>je n'ai pas</b>."],
     ex:[["Je ne suis pas étudiant.","Não sou estudante."],["Elle n'habite pas ici.","Ela não mora aqui."]],
     tip:"Na fala do dia a dia, o <b>ne</b> costuma sumir: “Je suis pas étudiant”. Escreva sempre com ele."},
    {h:"Três jeitos de perguntar",
     p:["Pela entonação: <b>Vous êtes étudiant ?</b> Com <b>est-ce que</b>: <b>Est-ce que vous êtes étudiant ?</b> Com palavra de pergunta: <b>Quel est votre nom ?</b> <b>Vous habitez où ?</b>"],
     ex:[["Est-ce que tu es français ?","Você é francês?"],["Tu habites où ?","Onde você mora?"]]}
  ],
  vocab:[
    {h:"Perguntas pessoais",items:[["Quel est votre nom ?","Qual é o seu nome? (formal)"],["Vous avez quel âge ?","Quantos anos o senhor tem?"],["Tu as quel âge ?","Quantos anos você tem?"],["Vous habitez où ?","Onde o senhor mora?"],["Est-ce que… ?","(introduz pergunta)"],["D'accord.","Certo. Combinado."]]},
    {h:"Palavras úteis",items:[["nouveau, nouvelle","novo, nova"],["le numéro de téléphone","o número de telefone"],["l'âge","a idade"],["un an","um ano"]]}
  ],
  numbers:[["11","onze"],["12","douze"],["13","treize"],["14","quatorze"],["15","quinze"],["16","seize"],["17","dix-sept"],["20","vingt"],["30","trente"],["40","quarante"],["50","cinquante"],["60","soixante"]],
  pron:[
    {h:"vingt",p:"O g e o t de <b>vingt</b> são mudos quando ele está sozinho: “vã”. Em <b>vingt-cinq</b>, o t aparece: “vãt-sank”.",w:["vingt","vingt-cinq"]},
    {h:"ans se liga ao número",p:"Com <b>ans</b>, o número se liga ao a: <b>deux_ans</b> soa “dözã”, <b>trois_ans</b> soa “truazã”.",w:["deux ans","trois ans","vingt-cinq ans"]},
    {h:"A pergunta sobe",p:"Sem <b>est-ce que</b>, a pergunta depende só da entonação: a voz sobe no fim.",w:["Vous êtes étudiant ?"]}
  ],
  mc:[
    {q:"Quantos anos o Lucas tem?",o:["15","25","35"],a:1,e:"J'ai vingt-cinq ans."},
    {q:"O Lucas é estudante?",o:["Sim","Não, ele trabalha"],a:1,e:"Je ne suis pas étudiant. Je travaille."},
    {q:"Como dizer “Tenho 30 anos”?",o:["Je suis 30 ans.","J'ai 30 ans."],a:1,e:"Em francês, idade usa avoir."},
    {q:"Qual negação está certa?",o:["Je pas suis étudiant.","Je ne suis pas étudiant."],a:1,e:"ne… pas em volta do verbo."}
  ],
  gaps:[
    {s:"J'___ vingt-cinq ans.",a:["ai"],h:"Tenho vinte e cinco anos."},
    {s:"Je ne suis ___ français.",a:["pas"],h:"Não sou francês."},
    {s:"___ que vous êtes étudiant ?",a:["Est-ce"],h:"O senhor é estudante?"},
    {s:"Vous ___ quel âge ?",a:["avez"],h:"Quantos anos o senhor tem?"},
    {s:"Elle ___ vingt ans.",a:["a"],h:"Ela tem vinte anos."}
  ],
  order:[
    {t:["Vous","avez","quel","âge ?"],h:"Quantos anos o senhor tem?"},
    {t:["Je","ne","suis","pas","étudiant."],h:"Não sou estudante."},
    {t:["Est-ce","que","tu","es","français ?"],h:"Você é francês?"}
  ],
  dict:[{t:"J'ai vingt-cinq ans."},{t:"Je ne suis pas étudiant.",alt:["Je ne suis pas étudiante."]},{t:"Vous avez quel âge ?"},{t:"quinze"},{t:"soixante"}],
  shadow:["Vous êtes nouveau ici ?","Vous avez quel âge ?","J'ai vingt-cinq ans.","Non, je ne suis pas étudiant."],
  write:{task:"Responda em francês: Comment vous vous appelez ? Vous avez quel âge ? Vous habitez où ? Vous êtes étudiant(e) ?",ph:"Je m'appelle … J'ai …"},
  cards:[
    ["Quantos anos o senhor tem?","Vous avez quel âge ?"],["Tenho 25 anos.","J'ai vingt-cinq ans."],["Não sou estudante.","Je ne suis pas étudiant(e)."],
    ["Você é francês?","Est-ce que tu es français ?"],["Ela tem vinte anos.","Elle a vingt ans."],["Qual é o seu nome? (formal)","Quel est votre nom ?"],
    ["Onde o senhor mora?","Vous habitez où ?"],["Eu trabalho.","Je travaille."]
  ]
},
/* ---------- 4 ---------- */
{
  title:"Ma famille",
  goal:"Apresentar pessoas da família e dizer de quem é cada coisa.",
  speakers:{"Claire":"f","Lucas":"m"},
  setting:"Claire mostra fotos da família no celular.",
  lines:[
    ["Lucas","C'est ta famille ?","É a sua família?"],
    ["Claire","Oui ! Voici mes parents. Mon père s'appelle Paul et ma mère s'appelle Anne.","É! Estes são meus pais. Meu pai se chama Paul e minha mãe se chama Anne."],
    ["Lucas","Et la jeune femme, c'est ta sœur ?","E a moça, é sua irmã?"],
    ["Claire","Oui, c'est ma sœur, Julie. Son mari est italien.","É, é minha irmã, Julie. O marido dela é italiano."],
    ["Lucas","Ils ont des enfants ?","Eles têm filhos?"],
    ["Claire","Oui, un fils et une fille. Leur fils a six ans.","Sim, um filho e uma filha. O filho deles tem seis anos."],
    ["Lucas","Et toi, tu as des frères ?","E você, tem irmãos?"],
    ["Claire","Non, je n'ai pas de frère. Et toi ?","Não, não tenho irmão. E você?"],
    ["Lucas","J'ai un frère et une sœur au Brésil.","Tenho um irmão e uma irmã no Brasil."]
  ],
  grammar:[
    {h:"Artigos",
     p:["Definidos: <b>le</b> (o), <b>la</b> (a), <b>l'</b> (antes de vogal), <b>les</b> (os, as). Indefinidos: <b>un</b> (um), <b>une</b> (uma), <b>des</b> (uns, umas)."],
     ex:[["le père, la mère, les parents","o pai, a mãe, os pais"],["un fils, une fille, des enfants","um filho, uma filha, filhos"]],
     tip:"No plural, o <b>des</b> é obrigatório: “Ils ont enfants” está errado. Diga <b>Ils ont des enfants</b>."},
    {h:"Possessivos",
     p:["<b>mon / ma / mes</b> (meu, minha, meus), <b>ton / ta / tes</b> (teu, tua), <b>son / sa / ses</b> (dele ou dela), <b>notre / nos</b> (nosso), <b>votre / vos</b> (seu, formal ou plural), <b>leur / leurs</b> (deles)."],
     ex:[["mon père, ma mère, mes parents","meu pai, minha mãe, meus pais"],["leur fils","o filho deles"]],
     tip:"Concorda com a <b>coisa</b>, não com o dono: <b>son mari</b> é “o marido dela”, porque <b>mari</b> é masculino."},
    {h:"Negação com un, une, des",
     p:["Depois de uma negação, <b>un</b>, <b>une</b> e <b>des</b> viram <b>de</b> (ou <b>d'</b>): <b>Je n'ai pas de frère.</b>"],
     ex:[["Je n'ai pas de sœur.","Não tenho irmã."],["Ils n'ont pas d'enfants.","Eles não têm filhos."]]}
  ],
  vocab:[
    {h:"Família",items:[["le père","o pai"],["la mère","a mãe"],["les parents","os pais"],["le frère","o irmão"],["la sœur","a irmã"],["le mari","o marido"],["la femme","a esposa, a mulher"],["le fils","o filho"],["la fille","a filha, a menina"],["les enfants","os filhos, as crianças"],["le grand-père","o avô"],["la grand-mère","a avó"]]},
    {h:"Apresentando",items:[["Voici…","Este é, estes são…"],["C'est…","É…"],["Ce sont…","São…"],["jeune","jovem"]]}
  ],
  pron:[
    {h:"fils e fille",p:"<b>fils</b> soa “fiss” (o l é mudo, o s aparece). <b>fille</b> soa “fiy”.",w:["fils","fille"]},
    {h:"sœur",p:"O <b>œu</b> é um “ê” com os lábios arredondados, parecido com o “ö” alemão.",w:["sœur","frère"]},
    {h:"le, la, les",p:"<b>le</b> soa “lë” (vogal neutra), <b>les</b> soa “lê”. É essa diferença que mostra o plural na fala.",w:["le père","les parents","les enfants"]}
  ],
  mc:[
    {q:"Como se chama a mãe da Claire?",o:["Julie","Anne","Paul"],a:1,e:"ma mère s'appelle Anne."},
    {q:"Qual é a nacionalidade do marido da Julie?",o:["français","italien","brésilien"],a:1,e:"Son mari est italien."},
    {q:"Como dizer “o marido dela”?",o:["sa mari","son mari"],a:1,e:"mari é masculino: son."},
    {q:"Como dizer “Não tenho irmão”?",o:["Je n'ai pas un frère.","Je n'ai pas de frère."],a:1,e:"Depois da negação, un vira de."}
  ],
  gaps:[
    {s:"C'est ___ père.",a:["mon"],h:"Este é meu pai."},
    {s:"C'est ___ mère.",a:["ma"],h:"Esta é minha mãe."},
    {s:"Voici ___ parents.",a:["mes"],h:"Estes são meus pais."},
    {s:"Ils ont ___ enfants.",a:["des"],h:"Eles têm filhos."},
    {s:"Je n'ai pas ___ sœur.",a:["de"],h:"Não tenho irmã."}
  ],
  order:[
    {t:["Mon","père","s'appelle","Paul."],h:"Meu pai se chama Paul."},
    {t:["Ils","ont","deux","enfants."],h:"Eles têm dois filhos."},
    {t:["Je","n'ai","pas","de","frère."],h:"Não tenho irmão."}
  ],
  dict:[{t:"C'est ma sœur."},{t:"Voici mes parents."},{t:"Son mari est italien."},{t:"le fils"},{t:"la fille"}],
  shadow:["C'est ta famille ?","Voici mes parents.","Son mari est italien.","Je n'ai pas de frère."],
  write:{task:"Apresente 3 pessoas da sua família em francês: quem são, o nome e a idade.",ph:"Voici ma mère. Elle s'appelle …"},
  cards:[
    ["Este é meu pai.","C'est mon père."],["Esta é minha mãe.","C'est ma mère."],["Estes são meus pais.","Voici mes parents."],
    ["O marido dela é italiano.","Son mari est italien."],["Eles têm dois filhos.","Ils ont deux enfants."],["Você tem irmãos?","Tu as des frères et sœurs ?"],
    ["Não tenho irmã.","Je n'ai pas de sœur."],["O filho deles tem seis anos.","Leur fils a six ans."]
  ]
},
/* ---------- 5 ---------- */
{
  title:"Les objets",
  goal:"Nomear objetos, perguntar o que é algo, o que tem num lugar e quanto custa.",
  speakers:{"Lucas":"m","Le vendeur":"m","Claire":"f"},
  setting:"Lucas e Claire passeiam numa feira de antiguidades em Lyon.",
  lines:[
    ["Lucas","Bonjour, qu'est-ce que c'est ?","Bom dia, o que é isso?"],
    ["Le vendeur","C'est une vieille radio. Elle marche très bien !","É um rádio antigo. Funciona muito bem!"],
    ["Lucas","Elle coûte combien ?","Quanto custa?"],
    ["Le vendeur","Quinze euros.","Quinze euros."],
    ["Claire","Il y a des livres aussi ?","Tem livros também?"],
    ["Le vendeur","Oui, il y a des livres et des cartes postales, là-bas.","Tem, sim: livros e cartões-postais, ali."],
    ["Claire","C'est combien, les cartes postales ?","Quanto custam os cartões-postais?"],
    ["Le vendeur","Un euro la carte.","Um euro cada."],
    ["Lucas","Super ! Une radio et deux cartes, s'il vous plaît.","Ótimo! Um rádio e dois cartões, por favor."]
  ],
  grammar:[
    {h:"Todo substantivo tem gênero",
     p:["Em francês, toda coisa é masculina ou feminina, e nem sempre bate com o português: <b>la radio</b> (o rádio), <b>la voiture</b> (o carro), <b>le lait</b> (o leite)."],
     ex:[["un livre","um livro"],["une radio","um rádio"],["une voiture","um carro"]],
     tip:"Aprenda cada palavra junto com o artigo: não “livre”, mas <b>un livre</b>."},
    {h:"Plural: o s é mudo",
     p:["Em geral, o plural ganha <b>-s</b>, mas ele não é pronunciado: <b>livre</b> e <b>livres</b> soam iguais. Na fala, quem mostra o plural é o artigo: <b>le livre</b> (“lë”) e <b>les livres</b> (“lê”)."],
     ex:[["le livre, les livres","o livro, os livros"],["une carte, des cartes","um cartão, cartões"]]},
    {h:"Il y a: tem, há",
     p:["<b>Il y a</b> diz que algo existe num lugar: <b>Il y a des livres.</b> Negativa: <b>Il n'y a pas de</b>… Pergunta: <b>Il y a… ?</b> ou <b>Est-ce qu'il y a… ?</b>"],
     ex:[["Il y a un parc ici.","Tem um parque aqui."],["Il n'y a pas de stylo.","Não tem caneta."]],
     tip:"Para “tem” no sentido de “existe”, nunca use <b>il a</b>: isso quer dizer “ele tem”."},
    {h:"C'est e o preço",
     p:["<b>Qu'est-ce que c'est ?</b> (O que é isso?) — <b>C'est une radio.</b> Para o preço: <b>Ça coûte combien ?</b> ou <b>C'est combien ?</b>"],
     ex:[["C'est combien ?","Quanto é?"],["Ça coûte quinze euros.","Custa quinze euros."]]}
  ],
  vocab:[
    {h:"Objetos",items:[["le livre","o livro"],["le sac","a bolsa"],["la clé","a chave"],["le téléphone","o telefone"],["le portefeuille","a carteira"],["la radio","o rádio"],["la carte postale","o cartão-postal"],["le stylo","a caneta"],["la montre","o relógio de pulso"],["les lunettes","os óculos"]]},
    {h:"Comprando",items:[["Ça coûte combien ?","quanto custa?"],["C'est combien ?","quanto é?"],["un euro","um euro"],["s'il vous plaît","por favor"],["là-bas","ali, lá"],["cher","caro"],["vieux, vieille","velho, velha, antigo"]]}
  ],
  pron:[
    {h:"le ou les?",p:"<b>le</b> soa “lë”, com a boca relaxada. <b>les</b> soa “lê”, com sorriso. Treine em pares.",w:["le livre","les livres"]},
    {h:"s'il vous plaît",p:"Na fala, vira quase uma palavra: “sil-vu-PLÉ”.",w:["s'il vous plaît"]},
    {h:"euro",p:"O <b>eu</b> soa “ö”, com lábios arredondados: “ö-RÔ”.",w:["un euro","quinze euros"]}
  ],
  mc:[
    {q:"Quanto custa o rádio?",o:["5 €","15 €","50 €"],a:1,e:"Quinze euros."},
    {q:"Quanto custa cada cartão-postal?",o:["1 €","2 €","10 €"],a:0,e:"Un euro la carte."},
    {q:"“Rádio” em francês é…",o:["le radio","la radio"],a:1,e:"Em francês, radio é feminino."},
    {q:"Como perguntar “Tem livros?”",o:["Il y a des livres ?","Il a des livres ?"],a:0,e:"Il y a = tem, existe."}
  ],
  gaps:[
    {s:"___ y a des livres ?",a:["Il"],h:"Tem livros?"},
    {s:"C'est ___ radio.",a:["une"],h:"É um rádio."},
    {s:"Ça coûte ___ ?",a:["combien"],h:"Quanto custa?"},
    {s:"Il n'y a pas ___ stylo.",a:["de"],h:"Não tem caneta."},
    {s:"Deux cartes, s'il vous ___.",a:["plaît"],h:"Dois cartões, por favor."}
  ],
  order:[
    {t:["Qu'est-ce","que","c'est ?"],h:"O que é isso?"},
    {t:["Il","y","a","des","livres."],h:"Tem livros."},
    {t:["Ça","coûte","combien ?"],h:"Quanto custa?"}
  ],
  dict:[{t:"Qu'est-ce que c'est ?"},{t:"Il y a des livres."},{t:"Ça coûte combien ?"},{t:"s'il vous plaît"},{t:"la montre"}],
  shadow:["Qu'est-ce que c'est ?","Elle coûte combien ?","Il y a des livres aussi ?","Une radio et deux cartes, s'il vous plaît."],
  write:{task:"Descreva 4 objetos perto de você agora, usando c'est e il y a.",ph:"Il y a un livre. C'est un livre de …"},
  cards:[
    ["O que é isso?","Qu'est-ce que c'est ?"],["É um rádio.","C'est une radio."],["Quanto custa?","Ça coûte combien ?"],
    ["Tem livros?","Il y a des livres ?"],["Não tem caneta.","Il n'y a pas de stylo."],["Por favor.","S'il vous plaît."],
    ["Ali.","Là-bas."],["Dois cartões-postais.","Deux cartes postales."]
  ]
},
/* ---------- 6 ---------- */
{
  title:"Ma journée",
  goal:"Contar a sua rotina, dizer as horas e perguntar sobre o dia de outra pessoa.",
  speakers:{"Claire":"f","Lucas":"m"},
  setting:"No café antes da aula, Claire repara que o Lucas está com sono.",
  lines:[
    ["Claire","Tu as l'air fatigué !","Você parece cansado!"],
    ["Lucas","Je me lève à six heures tous les jours.","Eu me levanto às seis todos os dias."],
    ["Claire","Pourquoi si tôt ?","Por que tão cedo?"],
    ["Lucas","Je travaille le matin et j'étudie l'après-midi.","Trabalho de manhã e estudo à tarde."],
    ["Claire","Tu déjeunes à quelle heure ?","A que horas você almoça?"],
    ["Lucas","À midi et demi. Et toi ?","Ao meio-dia e meia. E você?"],
    ["Claire","Moi, je ne travaille pas. J'étudie le matin et je regarde des séries le soir.","Eu não trabalho. Estudo de manhã e vejo séries à noite."],
    ["Lucas","Tu te couches tard ?","Você vai dormir tarde?"],
    ["Claire","Oui, vers minuit !","Vou, lá pela meia-noite!"]
  ],
  grammar:[
    {h:"Verbos em -er no presente",
     p:["A maioria dos verbos franceses termina em <b>-er</b> e segue o mesmo modelo. <b>parler</b>: je <b>parle</b>, tu <b>parles</b>, il <b>parle</b>, nous <b>parlons</b>, vous <b>parlez</b>, ils <b>parlent</b>."],
     ex:[["Je travaille le matin.","Trabalho de manhã."],["Nous étudions le français.","Estudamos francês."],["Ils regardent la télé.","Eles veem TV."]],
     tip:"<b>parle</b>, <b>parles</b> e <b>parlent</b> soam iguais: “parl”. Na fala, só <b>nous</b> e <b>vous</b> mudam o som."},
    {h:"Horas",
     p:["<b>Il est quelle heure ?</b> — <b>Il est huit heures.</b> Para dizer a que horas: <b>à</b> + hora: <b>à six heures</b>. <b>et quart</b> (e quinze), <b>et demie</b> (e meia), <b>moins le quart</b> (quinze para)."],
     ex:[["à huit heures et demie","às oito e meia"],["à neuf heures moins le quart","às quinze para as nove"],["à midi, à minuit","ao meio-dia, à meia-noite"]],
     tip:"Com <b>midi</b> e <b>minuit</b>, escreve-se <b>et demi</b>, sem e no final."},
    {h:"Je me lève, je me couche",
     p:["Alguns verbos de rotina vêm com <b>me</b>, <b>te</b>, <b>se</b>, como “eu me levanto” em português: <b>je me lève</b>, <b>tu te lèves</b>, <b>il se lève</b>. Por enquanto, guarde as formas com je e tu."],
     ex:[["Je me lève à sept heures.","Eu me levanto às sete."],["Tu te couches à quelle heure ?","A que horas você vai dormir?"]]},
    {h:"Partes do dia",
     p:["<b>le matin</b> (de manhã), <b>l'après-midi</b> (à tarde), <b>le soir</b> (à noite), <b>la nuit</b> (de madrugada). Sem preposição: <b>je travaille le matin</b>."],
     ex:[["tous les jours","todos os dias"],["le soir","à noite"]]}
  ],
  vocab:[
    {h:"Rotina",items:[["se lever","levantar-se"],["prendre le petit-déjeuner","tomar café da manhã"],["travailler","trabalhar"],["déjeuner","almoçar"],["étudier","estudar"],["rentrer à la maison","voltar para casa"],["dîner","jantar"],["se coucher","ir dormir"]]},
    {h:"Horas",items:[["Il est quelle heure ?","que horas são?"],["huit heures","oito horas"],["huit heures et quart","oito e quinze"],["huit heures et demie","oito e meia"],["neuf heures moins le quart","quinze para as nove"],["midi","meio-dia"],["minuit","meia-noite"],["tôt, tard","cedo, tarde"]]}
  ],
  pron:[
    {h:"O -ent mudo",p:"No verbo, <b>-ent</b> é mudo: <b>ils travaillent</b> soa igual a <b>il travaille</b>.",w:["il travaille","ils travaillent"]},
    {h:"heure se liga ao número",p:"O h de <b>heure</b> é mudo, então o número se liga: <b>six_heures</b> soa “sizör”, <b>deux_heures</b> soa “dözör”.",w:["six heures","deux heures","neuf heures"]},
    {h:"matin e soir",p:"<b>matin</b> termina num “ã” nasal: “matã”. <b>soir</b> soa “suar”.",w:["le matin","le soir"]}
  ],
  mc:[
    {q:"A que horas o Lucas se levanta?",o:["6h","7h","12h"],a:0,e:"Je me lève à six heures."},
    {q:"A Claire trabalha?",o:["Sim","Não"],a:1,e:"Je ne travaille pas."},
    {q:"Como soa “ils travaillent”?",o:["Igual a “il travaille”","Com o -ent pronunciado"],a:0,e:"O -ent dos verbos é mudo."},
    {q:"Como dizer “à tarde”?",o:["l'après-midi","le soir"],a:0,e:"le soir é à noite."}
  ],
  gaps:[
    {s:"Je me ___ à six heures.",a:["lève"],h:"Eu me levanto às seis."},
    {s:"Tu déjeunes à quelle ___ ?",a:["heure"],h:"A que horas você almoça?"},
    {s:"Nous ___ français.",a:["parlons"],h:"Nós falamos francês."},
    {s:"Je travaille ___ matin.",a:["le"],h:"Trabalho de manhã."},
    {s:"Vous ___ le soir ?",a:["étudiez"],h:"Vocês estudam à noite?"}
  ],
  order:[
    {t:["Je","travaille","le","matin."],h:"Trabalho de manhã."},
    {t:["Il","est","huit","heures."],h:"São oito horas."},
    {t:["Tu","te","couches","tard ?"],h:"Você vai dormir tarde?"}
  ],
  dict:[{t:"Je me lève à six heures."},{t:"Il est midi."},{t:"Nous parlons français."},{t:"le soir"},{t:"Tu déjeunes à quelle heure ?"}],
  shadow:["Je me lève à six heures tous les jours.","Tu déjeunes à quelle heure ?","À midi et demi. Et toi ?","Tu te couches tard ?"],
  write:{task:"Descreva sua rotina em francês, com horários: a que horas se levanta, trabalha ou estuda, almoça e vai dormir.",ph:"Je me lève à …"},
  cards:[
    ["Eu me levanto às seis.","Je me lève à six heures."],["Que horas são?","Il est quelle heure ?"],["São oito horas.","Il est huit heures."],
    ["Trabalho de manhã.","Je travaille le matin."],["A que horas você almoça?","Tu déjeunes à quelle heure ?"],["Vou dormir à meia-noite.","Je me couche à minuit."],
    ["Nós falamos francês.","Nous parlons français."],["Todos os dias.","Tous les jours."]
  ]
},
/* ---------- 7 ---------- */
{
  title:"Les métiers",
  goal:"Falar da sua profissão e da de outras pessoas, e de onde trabalham.",
  speakers:{"Lucas":"m","Claire":"f"},
  setting:"Lucas e Claire conversam sobre trabalho e família.",
  lines:[
    ["Lucas","Qu'est-ce que tu fais dans la vie ?","O que você faz da vida?"],
    ["Claire","Je suis infirmière. Je travaille dans un hôpital.","Sou enfermeira. Trabalho num hospital."],
    ["Lucas","Tu travailles la nuit ?","Você trabalha de madrugada?"],
    ["Claire","Oui, parfois. Et toi, tu fais quoi ?","Às vezes. E você, faz o quê?"],
    ["Lucas","Je suis développeur. Je travaille à la maison.","Sou desenvolvedor. Trabalho em casa."],
    ["Claire","Et ta sœur ?","E a sua irmã?"],
    ["Lucas","Elle est avocate. Son bureau est à São Paulo.","Ela é advogada. O escritório dela fica em São Paulo."],
    ["Claire","Et ton frère ?","E o seu irmão?"],
    ["Lucas","Il est encore étudiant. Il fait des études de médecine.","Ainda é estudante. Estuda medicina."]
  ],
  grammar:[
    {h:"O verbo faire",
     p:["<b>je fais</b>, <b>tu fais</b>, <b>il fait</b>, <b>nous faisons</b>, <b>vous faites</b>, <b>ils font</b>. É o “fazer”."],
     ex:[["Qu'est-ce que tu fais dans la vie ?","O que você faz da vida?"],["Vous faites quoi ?","O que vocês fazem?"]],
     tip:"<b>vous faites</b> é irregular: “vous faisez” não existe."},
    {h:"Profissão sem artigo",
     p:["Depois de <b>être</b>, a profissão vem sem artigo, como em português: <b>Je suis infirmière.</b> Mas com <b>c'est</b> o artigo volta: <b>C'est un médecin.</b>"],
     ex:[["Il est médecin.","Ele é médico."],["C'est une avocate.","É uma advogada."]],
     tip:"É o contrário do inglês: em francês, não diga “Je suis un médecin”."},
    {h:"Profissões no feminino",
     p:["Muitas seguem modelos: <b>-ier</b> → <b>-ière</b> (infirmier, infirmière), <b>-eur</b> → <b>-euse</b> (serveur, serveuse), <b>-t</b> → <b>-te</b> (avocat, avocate). Algumas só mudam o artigo: <b>un</b> ou <b>une</b> médecin."],
     ex:[["un serveur, une serveuse","um garçom, uma garçonete"],["un avocat, une avocate","um advogado, uma advogada"]]}
  ],
  vocab:[
    {h:"Profissões",items:[["médecin","médico, médica"],["infirmier, infirmière","enfermeiro, enfermeira"],["avocat, avocate","advogado, advogada"],["professeur, professeure","professor, professora"],["ingénieur, ingénieure","engenheiro, engenheira"],["développeur, développeuse","desenvolvedor, desenvolvedora"],["serveur, serveuse","garçom, garçonete"],["vendeur, vendeuse","vendedor, vendedora"]]},
    {h:"Lugares de trabalho",items:[["un hôpital","um hospital"],["un bureau","um escritório"],["une école","uma escola"],["un restaurant","um restaurante"],["un magasin","uma loja"],["à la maison","em casa"],["parfois","às vezes"],["encore","ainda"]]}
  ],
  pron:[
    {h:"As formas de faire",p:"<b>fais</b> e <b>fait</b> soam “fé”. <b>faisons</b> soa “fëzõ” e <b>faites</b> soa “fét”. <b>font</b> soa “fõ”.",w:["je fais","nous faisons","vous faites","ils font"]},
    {h:"O h mudo de hôpital",p:"O h de <b>hôpital</b> é mudo, então se liga: <b>un_hôpital</b> soa “ënopital”.",w:["un hôpital"]},
    {h:"-ier e -ière",p:"<b>infirmier</b> termina em “iê”; <b>infirmière</b> termina em “iér”, com o r aparecendo.",w:["infirmier","infirmière"]}
  ],
  mc:[
    {q:"Qual é a profissão da Claire?",o:["médecin","infirmière","avocate"],a:1,e:"Je suis infirmière."},
    {q:"Onde o Lucas trabalha?",o:["Num escritório","Em casa","Num hospital"],a:1,e:"Je travaille à la maison."},
    {q:"Como dizer “Sou médico”?",o:["Je suis un médecin.","Je suis médecin."],a:1,e:"Com profissões, depois de être não se usa artigo."},
    {q:"Como dizer “vocês fazem”?",o:["vous faisez","vous faites"],a:1,e:"faites é irregular."}
  ],
  gaps:[
    {s:"Qu'est-ce que tu ___ dans la vie ?",a:["fais"],h:"O que você faz da vida?"},
    {s:"Elle est ___.",a:["avocate"],h:"Ela é advogada."},
    {s:"Vous ___ quoi ?",a:["faites"],h:"O que vocês fazem?"},
    {s:"Je travaille dans un ___.",a:["hôpital"],h:"Trabalho num hospital."},
    {s:"Ils ___ des études de médecine.",a:["font"],h:"Eles estudam medicina."}
  ],
  order:[
    {t:["Je","suis","infirmière."],h:"Sou enfermeira."},
    {t:["Il","travaille","dans","un","bureau."],h:"Ele trabalha num escritório."},
    {t:["Qu'est-ce","que","vous","faites ?"],h:"O que vocês fazem?"}
  ],
  dict:[{t:"Je suis développeur."},{t:"Elle est avocate."},{t:"Qu'est-ce que tu fais ?"},{t:"un hôpital"},{t:"vous faites"}],
  shadow:["Qu'est-ce que tu fais dans la vie ?","Je suis infirmière. Je travaille dans un hôpital.","Je suis développeur.","Il est encore étudiant."],
  write:{task:"Diga a sua profissão e a de 2 pessoas da sua família, e onde vocês trabalham.",ph:"Je suis … Je travaille …"},
  cards:[
    ["O que você faz da vida?","Qu'est-ce que tu fais dans la vie ?"],["Sou enfermeira.","Je suis infirmière."],["Ele é médico.","Il est médecin."],
    ["Ela é advogada.","Elle est avocate."],["Trabalho em casa.","Je travaille à la maison."],["O que vocês fazem?","Vous faites quoi ?"],
    ["Ele trabalha num escritório.","Il travaille dans un bureau."],["Ela é garçonete.","Elle est serveuse."]
  ]
},
/* ---------- 8 ---------- */
{
  title:"Loisirs",
  goal:"Dizer do que você gosta, o que pratica e em que dias.",
  speakers:{"Lucas":"m","Claire":"f"},
  setting:"Lucas e Claire conversam sobre o fim de semana.",
  lines:[
    ["Lucas","Qu'est-ce que tu aimes faire le week-end ?","O que você gosta de fazer no fim de semana?"],
    ["Claire","J'adore lire. Et je fais du vélo le dimanche.","Adoro ler. E ando de bicicleta aos domingos."],
    ["Lucas","Tu aimes le sport ?","Você gosta de esporte?"],
    ["Claire","Oui, mais je déteste courir ! Et toi ?","Gosto, mas detesto correr! E você?"],
    ["Lucas","Moi, je joue au foot avec des amis le samedi.","Eu jogo futebol com amigos aos sábados."],
    ["Claire","Tu joues d'un instrument ?","Você toca algum instrumento?"],
    ["Lucas","Oui, je joue de la guitare. Mais pas très bien !","Toco violão. Mas não muito bem!"],
    ["Claire","On fait de la musique ensemble un jour ?","Vamos tocar juntos um dia?"],
    ["Lucas","Avec plaisir !","Com prazer!"]
  ],
  grammar:[
    {h:"aimer, adorer, détester + infinitivo",
     p:["Depois desses verbos, o outro verbo vem no infinitivo e <b>sem preposição</b>: <b>J'aime lire</b>, <b>Je déteste courir</b>."],
     ex:[["J'adore voyager.","Adoro viajar."],["Tu aimes danser ?","Você gosta de dançar?"]],
     tip:"Não existe o “de” do português: “J'aime de lire” está errado."},
    {h:"aimer + le, la, les",
     p:["Para gostos em geral, o francês usa o artigo definido: <b>J'aime le sport</b>, <b>J'aime la musique</b>, <b>J'aime les films</b>."],
     ex:[["Je déteste le café.","Detesto café."],["Elle adore les chats.","Ela adora gatos."]]},
    {h:"jouer à, jouer de, faire de",
     p:["Esportes e jogos: <b>jouer à</b> → <b>je joue au foot</b>, <b>aux cartes</b>. Instrumentos: <b>jouer de</b> → <b>je joue de la guitare</b>, <b>du piano</b>. Muitas atividades usam <b>faire de</b>: <b>faire du vélo</b>, <b>faire de la natation</b>."],
     ex:[["Il joue au tennis.","Ele joga tênis."],["Je fais de la natation.","Faço natação."]]},
    {h:"le samedi: aos sábados",
     p:["Com artigo, o dia indica hábito: <b>le samedi</b> = todo sábado. Sem artigo, um dia específico: <b>samedi</b> = este sábado."],
     ex:[["Je joue au foot le samedi.","Jogo futebol aos sábados."],["On se voit samedi ?","A gente se vê no sábado?"]]}
  ],
  vocab:[
    {h:"Atividades",items:[["lire","ler"],["courir","correr"],["nager","nadar"],["cuisiner","cozinhar"],["danser","dançar"],["voyager","viajar"],["regarder la télé","ver TV"],["écouter de la musique","ouvir música"],["faire du vélo","andar de bicicleta"],["jouer au foot","jogar futebol"],["jouer de la guitare","tocar violão"]]},
    {h:"Expressões",items:[["le week-end","o fim de semana"],["ensemble","juntos"],["avec des amis","com amigos"],["Avec plaisir !","com prazer!"],["pas très bien","não muito bem"]]}
  ],
  pron:[
    {h:"aime, aimes, aiment",p:"As três soam iguais: “ém”.",w:["j'aime","tu aimes","ils aiment"]},
    {h:"foot e week-end",p:"Palavras emprestadas do inglês, com sotaque francês: <b>foot</b> soa “fut”, <b>week-end</b> soa “uikénd”.",w:["le foot","le week-end"]},
    {h:"du e de",p:"<b>du</b> tem o u francês (lábios em bico); <b>de</b> tem a vogal neutra “ë”.",w:["du vélo","de la guitare"]}
  ],
  mc:[
    {q:"O que a Claire detesta?",o:["lire","courir","faire du vélo"],a:1,e:"je déteste courir !"},
    {q:"Que instrumento o Lucas toca?",o:["le piano","la guitare"],a:1,e:"je joue de la guitare."},
    {q:"Como dizer “Gosto de ler”?",o:["J'aime de lire.","J'aime lire."],a:1,e:"Sem preposição."},
    {q:"Como dizer “Jogo futebol”?",o:["Je joue du foot.","Je joue au foot."],a:1,e:"Esportes usam jouer à."}
  ],
  gaps:[
    {s:"J'adore ___.",a:["lire"],h:"Adoro ler."},
    {s:"Je joue ___ foot.",a:["au"],h:"Jogo futebol."},
    {s:"Je joue ___ la guitare.",a:["de"],h:"Toco violão."},
    {s:"Je fais ___ vélo.",a:["du"],h:"Ando de bicicleta."},
    {s:"Elle ___ courir.",a:["déteste"],h:"Ela detesta correr."}
  ],
  order:[
    {t:["J'aime","écouter","de","la","musique."],h:"Gosto de ouvir música."},
    {t:["Je","fais","du","vélo","le","dimanche."],h:"Ando de bicicleta aos domingos."},
    {t:["Tu","joues","d'un","instrument ?"],h:"Você toca algum instrumento?"}
  ],
  dict:[{t:"J'adore lire."},{t:"Je joue au foot."},{t:"Je déteste courir."},{t:"le week-end"},{t:"Avec plaisir !"}],
  shadow:["Qu'est-ce que tu aimes faire le week-end ?","J'adore lire.","Je joue au foot avec des amis le samedi.","Avec plaisir !"],
  write:{task:"Conte do que você gosta e não gosta de fazer no tempo livre, e em que dias faz cada coisa.",ph:"J'aime … Le samedi, je …"},
  cards:[
    ["Adoro ler.","J'adore lire."],["Detesto correr.","Je déteste courir."],["Jogo futebol aos sábados.","Je joue au foot le samedi."],
    ["Toco violão.","Je joue de la guitare."],["Ando de bicicleta.","Je fais du vélo."],["O que você gosta de fazer?","Qu'est-ce que tu aimes faire ?"],
    ["Gosto de música.","J'aime la musique."],["Com prazer!","Avec plaisir !"]
  ]
},
/* ---------- 9 ---------- */
{
  title:"À table",
  goal:"Pedir comida e bebida num café ou restaurante com educação.",
  speakers:{"Le serveur":"m","Claire":"f","Lucas":"m"},
  setting:"Claire e Lucas sentam num café no centro de Lyon.",
  lines:[
    ["Le serveur","Bonjour, vous désirez ?","Bom dia, o que vão querer?"],
    ["Claire","Bonjour. Je voudrais un café, s'il vous plaît.","Bom dia. Eu queria um café, por favor."],
    ["Le serveur","Avec du lait ?","Com leite?"],
    ["Claire","Non, merci. Vous avez des croissants ?","Não, obrigada. Vocês têm croissants?"],
    ["Le serveur","Oui, et nous avons aussi de la tarte aux pommes.","Temos, e temos também torta de maçã."],
    ["Claire","Je vais prendre un croissant.","Vou querer um croissant."],
    ["Lucas","Et pour moi, un jus d'orange et un sandwich au fromage.","E para mim, um suco de laranja e um sanduíche de queijo."],
    ["Le serveur","Très bien. Je vous apporte ça.","Muito bem. Já trago."],
    ["Lucas","L'addition, s'il vous plaît !","A conta, por favor!"]
  ],
  grammar:[
    {h:"Partitivos: du, de la, de l', des",
     p:["Para uma quantidade que não se conta, o francês usa <b>du</b> (masculino), <b>de la</b> (feminino), <b>de l'</b> (antes de vogal) e <b>des</b> (plural). Em português muitas vezes não dizemos nada."],
     ex:[["Vous voulez du lait ?","Quer leite?"],["Je mange de la tarte.","Estou comendo torta."],["Je bois de l'eau.","Bebo água."]],
     tip:"“Je voudrais lait” está errado: o francês sempre exige um artigo antes do substantivo."},
    {h:"Na negativa, tudo vira de",
     p:["Depois de uma negação, <b>du</b>, <b>de la</b> e <b>des</b> viram <b>de</b> (ou <b>d'</b>): <b>Je ne veux pas de lait.</b> <b>Pas de sucre, merci.</b>"],
     ex:[["Il n'y a pas de pain.","Não tem pão."],["Pas de sucre, merci.","Sem açúcar, obrigado."]]},
    {h:"Pedindo com educação",
     p:["<b>Je voudrais…</b> (eu queria), <b>Je vais prendre…</b> (vou querer) e <b>Pour moi…</b> (para mim) são as formas naturais de pedir."],
     ex:[["Je voudrais un thé.","Eu queria um chá."],["Pour moi, une salade.","Para mim, uma salada."]],
     tip:"<b>Je veux</b> (eu quero) soa seco e mal-educado num restaurante."}
  ],
  vocab:[
    {h:"Comida e bebida",items:[["le café","o café"],["le thé","o chá"],["le lait","o leite"],["l'eau","a água"],["le jus d'orange","o suco de laranja"],["le pain","o pão"],["le fromage","o queijo"],["le croissant","o croissant"],["la tarte aux pommes","a torta de maçã"],["le sucre","o açúcar"]]},
    {h:"No café",items:[["Je voudrais…","eu queria…"],["Je vais prendre…","vou querer…"],["Pour moi…","para mim…"],["L'addition, s'il vous plaît.","a conta, por favor"],["la carte","o cardápio"],["Vous désirez ?","o que deseja?"]]}
  ],
  pron:[
    {h:"voudrais",p:"Soa “vu-DRÉ”: o s final é mudo.",w:["je voudrais"]},
    {h:"croissant",p:"Em francês: “krua-SÃ”, com o r da garganta e o final nasal.",w:["un croissant"]},
    {h:"de l'eau",p:"<b>l'eau</b> soa “lô”, igual a <b>lo</b>.",w:["de l'eau"]}
  ],
  mc:[
    {q:"O que a Claire pede para beber?",o:["un thé","un café","un jus d'orange"],a:1,e:"Je voudrais un café."},
    {q:"O que o Lucas pede para comer?",o:["un croissant","un sandwich au fromage","de la tarte"],a:1,e:"un sandwich au fromage."},
    {q:"Como perguntar “Quer leite?”",o:["Vous voulez lait ?","Vous voulez du lait ?"],a:1,e:"Precisa do partitivo du."},
    {q:"Como dizer “Sem açúcar”?",o:["Pas du sucre.","Pas de sucre."],a:1,e:"Depois da negação, du, de la e des viram de."}
  ],
  gaps:[
    {s:"Je ___ un café.",a:["voudrais"],h:"Eu queria um café."},
    {s:"Avec ___ lait ?",a:["du"],h:"Com leite?"},
    {s:"Je voudrais ___ l'eau.",a:["de"],h:"Eu queria água."},
    {s:"Vous avez ___ croissants ?",a:["des"],h:"Vocês têm croissants?"},
    {s:"L'___, s'il vous plaît.",a:["addition"],h:"A conta, por favor."}
  ],
  order:[
    {t:["Je","voudrais","un","café."],h:"Eu queria um café."},
    {t:["Vous","avez","des","croissants ?"],h:"Vocês têm croissants?"},
    {t:["L'addition,","s'il","vous","plaît."],h:"A conta, por favor."}
  ],
  dict:[{t:"Je voudrais un café."},{t:"Avec du lait ?"},{t:"L'addition, s'il vous plaît."},{t:"un jus d'orange"},{t:"de l'eau"}],
  shadow:["Je voudrais un café, s'il vous plaît.","Vous avez des croissants ?","Pour moi, un jus d'orange.","L'addition, s'il vous plaît !"],
  write:{task:"Escreva o seu pedido num café francês: bebida, comida e a conta.",ph:"Bonjour. Je voudrais …"},
  cards:[
    ["Eu queria um café.","Je voudrais un café."],["Com leite?","Avec du lait ?"],["Sem açúcar, obrigado.","Pas de sucre, merci."],
    ["Vocês têm croissants?","Vous avez des croissants ?"],["Para mim, um suco de laranja.","Pour moi, un jus d'orange."],["A conta, por favor.","L'addition, s'il vous plaît."],
    ["Eu queria água.","Je voudrais de l'eau."],["O cardápio, por favor.","La carte, s'il vous plaît."]
  ]
},
/* ---------- 10 ---------- */
{
  title:"En ville",
  goal:"Perguntar onde fica um lugar, entender direções e dizer aonde você vai.",
  speakers:{"Lucas":"m","Sophie":"f"},
  setting:"Lucas procura uma farmácia e pede ajuda a uma moradora, a Sophie.",
  lines:[
    ["Lucas","Pardon, madame, il y a une pharmacie près d'ici ?","Com licença, senhora, tem uma farmácia aqui perto?"],
    ["Sophie","Oui, dans la rue Victor-Hugo.","Tem, na rua Victor-Hugo."],
    ["Lucas","Comment je vais là-bas ?","Como eu chego lá?"],
    ["Sophie","Allez tout droit, puis tournez à gauche après la banque.","Siga reto e depois vire à esquerda depois do banco."],
    ["Lucas","À gauche après la banque, d'accord.","À esquerda depois do banco, certo."],
    ["Sophie","La pharmacie est à côté de la boulangerie, en face du parc.","A farmácia fica ao lado da padaria, em frente ao parque."],
    ["Lucas","C'est loin ?","É longe?"],
    ["Sophie","Non, c'est à cinq minutes à pied.","Não, fica a cinco minutos a pé."],
    ["Lucas","Merci beaucoup !","Muito obrigado!"],
    ["Sophie","Je vous en prie.","De nada."]
  ],
  grammar:[
    {h:"O verbo aller",
     p:["<b>je vais</b>, <b>tu vas</b>, <b>il va</b>, <b>nous allons</b>, <b>vous allez</b>, <b>ils vont</b>. É o “ir”."],
     ex:[["Je vais à la gare.","Vou à estação."],["Nous allons au musée.","Vamos ao museu."]]},
    {h:"à + le = au, de + le = du",
     p:["<b>à</b> e <b>de</b> se juntam com <b>le</b> e <b>les</b>: à + le = <b>au</b>, à + les = <b>aux</b>, de + le = <b>du</b>, de + les = <b>des</b>. Com <b>la</b> e <b>l'</b> não muda nada."],
     ex:[["Je vais au parc.","Vou ao parque."],["Je vais à la banque.","Vou ao banco."],["en face du parc","em frente ao parque"]],
     tip:"“à le parc” e “de le parc” nunca existem em francês."},
    {h:"Dando direções",
     p:["As direções usam o imperativo com <b>vous</b>: <b>Allez tout droit</b> (siga reto), <b>Tournez à gauche</b> (vire à esquerda), <b>Tournez à droite</b> (vire à direita), <b>Prenez la deuxième rue</b> (pegue a segunda rua)."],
     ex:[["Tournez à droite après le parc.","Vire à direita depois do parque."]]},
    {h:"Onde fica",
     p:["<b>à côté de</b> (ao lado de), <b>en face de</b> (em frente a), <b>entre</b> (entre), <b>près de</b> (perto de), <b>loin de</b> (longe de)."],
     ex:[["à côté de la boulangerie","ao lado da padaria"],["près d'ici","aqui perto"]]}
  ],
  vocab:[
    {h:"Lugares",items:[["la banque","o banco"],["la pharmacie","a farmácia"],["la boulangerie","a padaria"],["le supermarché","o supermercado"],["le parc","o parque"],["la gare","a estação de trem"],["l'arrêt de bus","o ponto de ônibus"],["le musée","o museu"],["la rue","a rua"]]},
    {h:"Direções",items:[["tout droit","reto"],["à gauche","à esquerda"],["à droite","à direita"],["à côté de","ao lado de"],["en face de","em frente a"],["près de","perto de"],["loin","longe"],["à pied","a pé"],["Je vous en prie.","de nada (formal)"]]}
  ],
  pron:[
    {h:"gauche e droite",p:"<b>gauche</b> soa “gôch”. <b>droite</b> soa “druat”, com o t aparecendo.",w:["à gauche","à droite"]},
    {h:"tout droit",p:"Soa “tu drua”: os dois t finais são mudos.",w:["tout droit"]},
    {h:"boulangerie",p:"O e do meio quase some: “bu-lãj-RI”.",w:["la boulangerie"]}
  ],
  mc:[
    {q:"Onde fica a farmácia?",o:["Ao lado da padaria","Ao lado do banco","Entre dois parques"],a:0,e:"à côté de la boulangerie, en face du parc."},
    {q:"A farmácia é longe?",o:["Sim, muito longe","Não, a cinco minutos a pé"],a:1,e:"c'est à cinq minutes à pied."},
    {q:"Como dizer “Vou ao parque”?",o:["Je vais à le parc.","Je vais au parc."],a:1,e:"à + le = au."},
    {q:"Como dizer “em frente ao parque”?",o:["en face du parc","en face de le parc"],a:0,e:"de + le = du."}
  ],
  gaps:[
    {s:"Je ___ à la gare.",a:["vais"],h:"Vou à estação."},
    {s:"Tournez à ___.",a:["gauche"],h:"Vire à esquerda."},
    {s:"Allez tout ___.",a:["droit"],h:"Siga reto."},
    {s:"C'est à côté ___ la banque.",a:["de"],h:"Fica ao lado do banco."},
    {s:"Nous ___ au musée.",a:["allons"],h:"Vamos ao museu."}
  ],
  order:[
    {t:["Il","y","a","une","pharmacie","près","d'ici ?"],h:"Tem uma farmácia aqui perto?"},
    {t:["Tournez","à","droite","après","le","parc."],h:"Vire à direita depois do parque."},
    {t:["Je","vais","au","supermarché."],h:"Vou ao supermercado."}
  ],
  dict:[{t:"Allez tout droit."},{t:"Tournez à gauche."},{t:"C'est loin ?"},{t:"en face du parc"},{t:"Je vais au supermarché."}],
  shadow:["Il y a une pharmacie près d'ici ?","Allez tout droit, puis tournez à gauche.","C'est loin ?","Je vous en prie."],
  write:{task:"Descreva o seu bairro em francês: o que tem perto da sua casa e onde fica cada lugar.",ph:"Il y a une boulangerie près de chez moi. Elle est à côté de …"},
  cards:[
    ["Tem uma farmácia aqui perto?","Il y a une pharmacie près d'ici ?"],["Siga reto.","Allez tout droit."],["Vire à esquerda.","Tournez à gauche."],
    ["Ao lado da padaria.","À côté de la boulangerie."],["Em frente ao parque.","En face du parc."],["É longe?","C'est loin ?"],
    ["Vou ao supermercado.","Je vais au supermarché."],["De nada.","Je vous en prie."]
  ]
},
/* ---------- 11 ---------- */
{
  title:"Je peux, je veux",
  goal:"Convidar, aceitar ou recusar, e dizer o que você pode, quer e tem que fazer.",
  speakers:{"Claire":"f","Lucas":"m"},
  setting:"Claire convida o Lucas para ir ao cinema.",
  lines:[
    ["Claire","Tu veux venir au cinéma samedi ?","Quer vir ao cinema no sábado?"],
    ["Lucas","Je veux bien, mais je ne peux pas samedi. Je dois travailler.","Eu queria, mas não posso no sábado. Tenho que trabalhar."],
    ["Claire","Dommage ! Et dimanche, tu peux ?","Que pena! E no domingo, você pode?"],
    ["Lucas","Oui, dimanche je peux. On peut aller au cinéma l'après-midi ?","Sim, no domingo eu posso. Podemos ir à tarde?"],
    ["Claire","D'accord. Je peux inviter Marta ?","Combinado. Posso convidar a Marta?"],
    ["Lucas","Bien sûr ! Elle veut voir le nouveau film ?","Claro! Ela quer ver o filme novo?"],
    ["Claire","Oui, elle adore. Mais on doit acheter les billets avant.","Quer, ela adora. Mas temos que comprar os ingressos antes."],
    ["Lucas","Pas de problème, j'achète les billets en ligne.","Sem problema, eu compro os ingressos on-line."]
  ],
  grammar:[
    {h:"pouvoir: poder",
     p:["<b>je peux</b>, <b>tu peux</b>, <b>il peut</b>, <b>nous pouvons</b>, <b>vous pouvez</b>, <b>ils peuvent</b>."],
     ex:[["Je ne peux pas samedi.","Não posso no sábado."],["Vous pouvez répéter ?","O senhor pode repetir?"]]},
    {h:"vouloir: querer",
     p:["<b>je veux</b>, <b>tu veux</b>, <b>il veut</b>, <b>nous voulons</b>, <b>vous voulez</b>, <b>ils veulent</b>. <b>Je veux bien</b> é um jeito simpático de aceitar."],
     ex:[["Tu veux venir ?","Quer vir?"],["Je veux bien !","Aceito, com prazer!"]]},
    {h:"devoir: ter que",
     p:["<b>je dois</b>, <b>tu dois</b>, <b>il doit</b>, <b>nous devons</b>, <b>vous devez</b>, <b>ils doivent</b>."],
     ex:[["Je dois travailler.","Tenho que trabalhar."],["On doit acheter les billets.","Temos que comprar os ingressos."]]},
    {h:"Os três + infinitivo",
     p:["Depois de <b>pouvoir</b>, <b>vouloir</b> e <b>devoir</b>, o verbo vem no infinitivo, sem preposição. <b>On</b> quer dizer “a gente” e usa a forma de il."],
     ex:[["On peut aller au cinéma.","A gente pode ir ao cinema."]],
     tip:"“Je dois de travailler” está errado. Diga <b>Je dois travailler</b>."}
  ],
  vocab:[
    {h:"Convites",items:[["Tu veux venir ?","quer vir?"],["Je veux bien.","aceito, com prazer"],["Je ne peux pas.","não posso"],["Dommage !","que pena!"],["D'accord.","combinado"],["Bien sûr !","claro!"],["Pas de problème.","sem problema"]]},
    {h:"Pedidos úteis",items:[["Vous pouvez répéter, s'il vous plaît ?","pode repetir, por favor?"],["Vous pouvez parler plus lentement ?","pode falar mais devagar?"],["Je peux entrer ?","posso entrar?"],["le cinéma","o cinema"],["le billet","o ingresso"],["en ligne","on-line"]]}
  ],
  pron:[
    {h:"peux e veux",p:"O <b>eu</b> soa “ö”: “pö”, “vö”. O x final é mudo.",w:["je peux","je veux"]},
    {h:"peuvent e veulent",p:"No plural, a consoante aparece: “pöv”, “völ”. O -ent continua mudo.",w:["ils peuvent","ils veulent"]},
    {h:"dois",p:"Soa “duá”: o s é mudo.",w:["je dois","ils doivent"]}
  ],
  mc:[
    {q:"Por que o Lucas não pode no sábado?",o:["Tem que trabalhar","Está doente","Vai viajar"],a:0,e:"Je dois travailler."},
    {q:"Quando eles vão ao cinema?",o:["Sábado à noite","Domingo à tarde"],a:1,e:"No diálogo: dimanche… l'après-midi (domingo à tarde)."},
    {q:"Como dizer “Tenho que trabalhar”?",o:["Je dois travailler.","Je dois de travailler."],a:0,e:"devoir + infinitivo, sem preposição."},
    {q:"Como pedir para repetir, de forma educada?",o:["Vous pouvez répéter ?","Vous peux répéter ?"],a:0,e:"Com vous: pouvez."}
  ],
  gaps:[
    {s:"Tu ___ venir ?",a:["veux"],h:"Quer vir?"},
    {s:"Je ne ___ pas samedi.",a:["peux"],h:"Não posso no sábado."},
    {s:"Je ___ travailler.",a:["dois"],h:"Tenho que trabalhar."},
    {s:"Nous ___ aller au cinéma.",a:["pouvons"],h:"Podemos ir ao cinema."},
    {s:"Vous pouvez parler plus ___ ?",a:["lentement"],h:"Pode falar mais devagar?"}
  ],
  order:[
    {t:["Tu","veux","venir","au","cinéma ?"],h:"Quer vir ao cinema?"},
    {t:["Je","dois","travailler","samedi."],h:"Tenho que trabalhar no sábado."},
    {t:["Vous","pouvez","répéter,","s'il","vous","plaît ?"],h:"Pode repetir, por favor?"}
  ],
  dict:[{t:"Je ne peux pas."},{t:"Je dois travailler."},{t:"Tu veux venir ?"},{t:"Dommage !"},{t:"Vous pouvez répéter ?"}],
  shadow:["Tu veux venir au cinéma samedi ?","Je veux bien, mais je ne peux pas.","Je dois travailler.","Vous pouvez répéter, s'il vous plaît ?"],
  write:{task:"Convide alguém para sair em francês e escreva a resposta: aceitando, ou recusando com uma desculpa.",ph:"Tu veux venir … ? — Je veux bien, mais …"},
  cards:[
    ["Quer vir ao cinema?","Tu veux venir au cinéma ?"],["Não posso no sábado.","Je ne peux pas samedi."],["Tenho que trabalhar.","Je dois travailler."],
    ["Que pena!","Dommage !"],["Claro!","Bien sûr !"],["Posso entrar?","Je peux entrer ?"],
    ["Pode repetir, por favor?","Vous pouvez répéter, s'il vous plaît ?"],["Pode falar mais devagar?","Vous pouvez parler plus lentement ?"]
  ]
},
/* ---------- 12 ---------- */
{
  title:"Mes projets",
  goal:"Falar dos seus planos, dizer datas, dias da semana e meses.",
  speakers:{"Claire":"f","Lucas":"m"},
  setting:"Perto do fim do ano, Claire e Lucas falam das férias.",
  lines:[
    ["Claire","Qu'est-ce que tu vas faire pendant les vacances ?","O que você vai fazer nas férias?"],
    ["Lucas","Je vais rentrer au Brésil en décembre.","Vou voltar para o Brasil em dezembro."],
    ["Claire","Super ! Tu vas voir ta famille ?","Que ótimo! Vai ver sua família?"],
    ["Lucas","Oui, et on va passer Noël ensemble. Et toi ?","Vou, e vamos passar o Natal juntos. E você?"],
    ["Claire","Moi, je vais aller à la montagne avec des amis. On va faire du ski !","Eu vou para a montanha com amigos. Vamos esquiar!"],
    ["Lucas","Tu pars quand ?","Quando você viaja?"],
    ["Claire","Le vingt décembre.","Dia vinte de dezembro."],
    ["Lucas","Et tu reviens quand ?","E volta quando?"],
    ["Claire","Le trois janvier.","Dia três de janeiro."],
    ["Lucas","Bonnes vacances !","Boas férias!"],
    ["Claire","Merci, toi aussi !","Obrigada, pra você também!"]
  ],
  grammar:[
    {h:"Futur proche: aller + infinitivo",
     p:["Para planos, use <b>aller</b> no presente + verbo no infinitivo, exatamente como “vou viajar” em português: <b>Je vais voyager.</b>"],
     ex:[["Je vais rentrer au Brésil.","Vou voltar para o Brasil."],["On va faire du ski.","Vamos esquiar."]]},
    {h:"Negativa do futuro próximo",
     p:["O <b>ne… pas</b> abraça o verbo <b>aller</b>: <b>Je ne vais pas travailler.</b>"],
     ex:[["Je ne vais pas sortir ce soir.","Não vou sair hoje à noite."]]},
    {h:"Datas",
     p:["<b>le</b> + número + mês: <b>le vingt décembre</b>. Só o dia 1º é diferente: <b>le premier janvier</b>. Para o mês inteiro: <b>en décembre</b>."],
     ex:[["le premier mai","1º de maio"],["le quatorze juillet","14 de julho"],["en août","em agosto"]],
     tip:"Dias da semana e meses são escritos com letra minúscula: <b>lundi</b>, <b>janvier</b>."},
    {h:"Partir e revenir",
     p:["Dois verbos de viagem, irregulares: <b>je pars</b>, <b>tu pars</b> (partir, viajar, ir embora); <b>je reviens</b>, <b>tu reviens</b> (voltar)."],
     ex:[["Tu pars quand ?","Quando você viaja?"],["Je reviens lundi.","Volto na segunda."]]}
  ],
  vocab:[
    {h:"Dias da semana",items:[["lundi","segunda-feira"],["mardi","terça-feira"],["mercredi","quarta-feira"],["jeudi","quinta-feira"],["vendredi","sexta-feira"],["samedi","sábado"],["dimanche","domingo"]]},
    {h:"Meses e férias",items:[["janvier","janeiro"],["février","fevereiro"],["mars","março"],["avril","abril"],["mai","maio"],["juin","junho"],["juillet","julho"],["août","agosto"],["septembre","setembro"],["octobre","outubro"],["novembre","novembro"],["décembre","dezembro"],["les vacances","as férias"],["Noël","o Natal"],["Bonnes vacances !","boas férias!"]]}
  ],
  pron:[
    {h:"août",p:"Soa só “ut” (ou “u”, para muitos franceses).",w:["août"]},
    {h:"premier",p:"Soa “prë-MIÊ”: o r final é mudo.",w:["le premier janvier"]},
    {h:"juin e juillet",p:"Os dois começam com o u francês seguido de vogal: “juã” e “jüi-IÉ”.",w:["juin","juillet"]}
  ],
  mc:[
    {q:"Quando o Lucas volta para o Brasil?",o:["Em novembro","Em dezembro","Em janeiro"],a:1,e:"en décembre."},
    {q:"O que a Claire vai fazer nas férias?",o:["Esquiar na montanha","Ir para a praia","Visitar o Brasil"],a:0,e:"On va faire du ski !"},
    {q:"Como dizer “Vou viajar”?",o:["Je vais voyager.","Je vais voyage."],a:0,e:"aller + infinitivo."},
    {q:"Como dizer “1º de janeiro”?",o:["le un janvier","le premier janvier"],a:1,e:"Só o dia 1º usa premier."}
  ],
  gaps:[
    {s:"Je ___ rentrer au Brésil.",a:["vais"],h:"Vou voltar para o Brasil."},
    {s:"On ___ faire du ski.",a:["va"],h:"Vamos esquiar."},
    {s:"Je ne vais ___ travailler.",a:["pas"],h:"Não vou trabalhar."},
    {s:"Le ___ janvier.",a:["premier"],h:"1º de janeiro."},
    {s:"Tu vas voir ___ famille ?",a:["ta"],h:"Você vai ver sua família?"}
  ],
  order:[
    {t:["Je","vais","voir","ma","famille."],h:"Vou ver minha família."},
    {t:["On","va","faire","du","ski."],h:"Vamos esquiar."},
    {t:["Nous","allons","partir","en","juillet."],h:"Vamos viajar em julho."}
  ],
  dict:[{t:"Je vais rentrer au Brésil."},{t:"le premier janvier"},{t:"Bonnes vacances !"},{t:"samedi"},{t:"Qu'est-ce que tu vas faire ?"}],
  shadow:["Qu'est-ce que tu vas faire pendant les vacances ?","Je vais rentrer au Brésil en décembre.","On va faire du ski !","Bonnes vacances !"],
  write:{task:"Conte seus planos para as próximas férias ou para o próximo fim de semana, com datas e dias, usando aller + infinitivo.",ph:"Le week-end prochain, je vais …"},
  cards:[
    ["O que você vai fazer?","Qu'est-ce que tu vas faire ?"],["Vou voltar para o Brasil.","Je vais rentrer au Brésil."],["Vamos esquiar.","On va faire du ski."],
    ["Não vou trabalhar.","Je ne vais pas travailler."],["Dia 1º de janeiro.","Le premier janvier."],["Em dezembro.","En décembre."],
    ["Boas férias!","Bonnes vacances !"],["Pra você também!","Toi aussi !"]
  ]
}
];
