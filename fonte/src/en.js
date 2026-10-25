module.exports = [
/* ---------- 2 ---------- */
{
  title:"Countries and nationalities",
  goal:"Dizer a nacionalidade de alguém e falar de outras pessoas: ele, ela, nós e eles.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Depois da aula, Lucas mostra para a Sarah quem são os colegas da turma.",
  lines:[
    ["Sarah","Who's that?","Quem é aquela?"],
    ["Lucas","That's Ana. She's Brazilian, too.","Aquela é a Ana. Ela também é brasileira."],
    ["Sarah","And who are they?","E quem são eles?"],
    ["Lucas","They're Kenji and Yuki. They're Japanese.","São o Kenji e a Yuki. Eles são japoneses."],
    ["Sarah","Are they students here?","Eles são alunos aqui?"],
    ["Lucas","Yes, they are. We're all in the same class.","São, sim. Estamos todos na mesma turma."],
    ["Sarah","And who's he?","E quem é ele?"],
    ["Lucas","He's Tom, the teacher. He's from London.","É o Tom, o professor. Ele é de Londres."],
    ["Sarah","Oh, he's British!","Ah, ele é britânico!"],
    ["Lucas","Yes, and he's very nice.","É, e ele é muito legal."]
  ],
  grammar:[
    {h:"O verbo to be completo",
     p:["Na Unidade 1 você viu <b>I am</b> e <b>you are</b>. Agora vêm as outras pessoas: <b>he is</b> (ele), <b>she is</b> (ela), <b>it is</b> (coisa ou animal), <b>we are</b> (nós), <b>they are</b> (eles, elas).","Na fala, use a forma curta: <b>he's</b>, <b>she's</b>, <b>it's</b>, <b>we're</b>, <b>they're</b>."],
     ex:[["She's Brazilian.","Ela é brasileira."],["We're students.","Nós somos alunos."],["They're from Japan.","Eles são do Japão."]],
     tip:"<b>They</b> serve para homens, mulheres ou grupos mistos. Não existe diferença entre “eles” e “elas”."},
    {h:"Nacionalidade com letra maiúscula",
     p:["Em inglês, nacionalidades e idiomas sempre começam com maiúscula: <b>Brazilian</b>, <b>Japanese</b>, <b>English</b>. Em português é o contrário."],
     ex:[["He's British.","Ele é britânico."],["I speak Portuguese.","Eu falo português."]]},
    {h:"País ou nacionalidade?",
     p:["Para o país, use <b>from</b>: <b>I'm from Brazil</b>. Para a nacionalidade, use direto: <b>I'm Brazilian</b>. As duas dizem a mesma coisa.","A nacionalidade não muda com gênero nem número: <b>She's Japanese</b>, <b>They're Japanese</b>."],
     ex:[["I'm from Mexico.","Eu sou do México."],["I'm Mexican.","Eu sou mexicano."]],
     tip:"Nunca diga “Japaneses” ou “Brazilians” para descrever pessoas: <b>They're Brazilian</b>."},
    {h:"Profissão pede a",
     p:["Antes de profissão no singular, o inglês usa <b>a</b>: <b>He's a teacher</b>. Em português não usamos artigo: “ele é professor”."],
     ex:[["She's a student.","Ela é aluna."],["He's a teacher.","Ele é professor."]]}
  ],
  vocab:[
    {h:"Nacionalidades",items:[["Brazilian","brasileiro"],["American","americano"],["Canadian","canadense"],["British","britânico"],["English","inglês (da Inglaterra)"],["French","francês"],["Portuguese","português"],["Japanese","japonês"],["Mexican","mexicano"],["Spanish","espanhol"]]},
    {h:"Pessoas",items:[["friend","amigo, amiga"],["student","aluno, estudante"],["teacher","professor"],["classmate","colega de turma"],["class","turma, aula"]]}
  ],
  pron:[
    {h:"-ese tem a força no fim",p:"Nacionalidades terminadas em <b>-ese</b> têm a força na última sílaba: ja-pa-NESE, por-tu-GUESE.",w:["Japanese","Portuguese","Chinese"]},
    {h:"O th que vibra",p:"Em <b>they</b>, <b>that</b> e <b>the</b>, ponha a língua entre os dentes como em <b>three</b>, mas deixe a garganta vibrar, como num “d” suave.",w:["they","that","the"]},
    {h:"he's e she's terminam em z",p:"O <b>'s</b> de <b>he's</b> e <b>she's</b> soa como “z”: “hiz”, “xiz”.",w:["he's","she's","Who's that?"]}
  ],
  mc:[
    {q:"De onde o Tom é?",o:["Brazil","London","Japan"],a:1,e:"Lucas diz: He's from London."},
    {q:"Qual é a nacionalidade da Ana?",o:["Japanese","British","Brazilian"],a:2,e:"She's Brazilian, too."},
    {q:"Qual frase está certa?",o:["They're Japaneses.","They're Japanese.","They're japanese."],a:1,e:"A nacionalidade não vai para o plural e começa com maiúscula."},
    {q:"Qual pronome usar para “Kenji e Yuki”?",o:["he","she","they"],a:2,e:"They serve para qualquer grupo."}
  ],
  gaps:[
    {s:"She ___ Brazilian.",a:["is","'s"],h:"Ela é brasileira."},
    {s:"They ___ from Japan.",a:["are","'re"],h:"Eles são do Japão."},
    {s:"We ___ students.",a:["are","'re"],h:"Nós somos alunos."},
    {s:"He's ___ London.",a:["from"],h:"Ele é de Londres."},
    {s:"I'm from Mexico. I'm ___.",a:["Mexican"],h:"Sou do México. Sou mexicano."}
  ],
  order:[
    {t:["She's","from","Brazil."],h:"Ela é do Brasil."},
    {t:["We're","in","the","same","class."],h:"Estamos na mesma turma."},
    {t:["He's","a","teacher."],h:"Ele é professor."}
  ],
  dict:[{t:"She's Brazilian."},{t:"They're from Japan."},{t:"We're students."},{t:"He's British."}],
  shadow:["Who's that?","That's Ana. She's Brazilian, too.","They're Kenji and Yuki. They're Japanese.","He's Tom, the teacher. He's from London."],
  write:{task:"Escreva 3 frases sobre pessoas que você conhece: o nome, de onde são e a nacionalidade.",ph:"Carla is from Brazil. She's Brazilian …"},
  cards:[
    ["Ela é brasileira.","She's Brazilian."],["Eles são japoneses.","They're Japanese."],["Nós somos alunos.","We're students."],
    ["Ele é de Londres.","He's from London."],["Quem é ele?","Who's he?"],["Quem são eles?","Who are they?"],
    ["Ela é professora.","She's a teacher."],["Estamos na mesma turma.","We're in the same class."]
  ]
},
/* ---------- 3 ---------- */
{
  title:"Questions and answers",
  goal:"Fazer e responder perguntas sobre dados pessoais, dizer a idade e negar informações.",
  speakers:{"Emma":"f","Lucas":"m"},
  setting:"Lucas faz a matrícula numa academia. Emma, a recepcionista, preenche a ficha dele.",
  lines:[
    ["Emma","Hi! Are you a new member?","Oi! Você é um membro novo?"],
    ["Lucas","Yes, I am.","Sou, sim."],
    ["Emma","What's your name?","Qual é o seu nome?"],
    ["Lucas","Lucas Silva.","Lucas Silva."],
    ["Emma","How old are you, Lucas?","Quantos anos você tem, Lucas?"],
    ["Lucas","I'm twenty-five.","Tenho vinte e cinco."],
    ["Emma","Are you American?","Você é americano?"],
    ["Lucas","No, I'm not. I'm Brazilian.","Não. Sou brasileiro."],
    ["Emma","What's your phone number?","Qual é o seu telefone?"],
    ["Lucas","It's five five five, oh one nine three.","É cinco cinco cinco, zero um nove três."],
    ["Emma","Great. You're all set!","Ótimo. Está tudo certo!"]
  ],
  grammar:[
    {h:"Pergunta: o verbo vai para a frente",
     p:["Para perguntar com <b>to be</b>, troque a ordem: <b>You are</b> vira <b>Are you…?</b> e <b>She is</b> vira <b>Is she…?</b>"],
     ex:[["Are you American?","Você é americano?"],["Is she a teacher?","Ela é professora?"],["Are they from Canada?","Eles são do Canadá?"]]},
    {h:"Negativa: not depois do verbo",
     p:["Coloque <b>not</b> depois do verbo: <b>I'm not</b>, <b>you aren't</b>, <b>he isn't</b>, <b>we aren't</b>, <b>they aren't</b>."],
     ex:[["I'm not American.","Não sou americano."],["She isn't a student.","Ela não é aluna."]],
     tip:"Com <b>to be</b> não se usa <b>don't</b>. “I don't American” está errado: o certo é <b>I'm not American</b>."},
    {h:"Respostas curtas",
     p:["Responda com <b>Yes</b> ou <b>No</b> + pronome + verbo: <b>Yes, I am.</b> <b>No, I'm not.</b> <b>Yes, she is.</b> <b>No, they aren't.</b>"],
     ex:[["Are you Brazilian? — Yes, I am.","Você é brasileiro? — Sou."],["Is he a teacher? — No, he isn't.","Ele é professor? — Não."]],
     tip:"Na resposta curta positiva não se contrai: diga <b>Yes, I am</b>, nunca “Yes, I'm”."},
    {h:"Idade com to be",
     p:["Em inglês você <b>é</b> uma idade, não <b>tem</b>: <b>I'm 25</b> ou <b>I'm 25 years old</b>. Para perguntar: <b>How old are you?</b>"],
     ex:[["I'm twenty-five.","Tenho vinte e cinco anos."],["How old is she?","Quantos anos ela tem?"]],
     tip:"“I have 25 years” é o erro mais comum de brasileiros."}
  ],
  vocab:[
    {h:"Perguntas pessoais",items:[["What's your name?","Qual é o seu nome?"],["How old are you?","Quantos anos você tem?"],["Where are you from?","De onde você é?"],["What's your phone number?","Qual é o seu telefone?"],["What's your email?","Qual é o seu e-mail?"]]},
    {h:"Palavras úteis",items:[["member","sócio, membro"],["new","novo"],["years old","anos de idade"],["oh","zero (falando números)"]]}
  ],
  numbers:[["11","eleven"],["12","twelve"],["13","thirteen"],["14","fourteen"],["15","fifteen"],["20","twenty"],["21","twenty-one"],["30","thirty"],["40","forty"],["50","fifty"],["100","a hundred"]],
  pron:[
    {h:"thirteen ou thirty?",p:"Nos números de 13 a 19 a força cai no fim: thir-TEEN. Nas dezenas, cai no começo: THIR-ty. É assim que se diferenciam.",w:["thirteen","thirty","fifteen","fifty"]},
    {h:"O zero vira “oh”",p:"Em telefones e números de quarto, o zero costuma ser dito como a letra O: “oh”.",w:["five five five, oh one nine three"]},
    {h:"A pergunta sobe",p:"Em perguntas de sim ou não, a voz sobe no final.",w:["Are you American?","Is she a teacher?"]}
  ],
  mc:[
    {q:"Quantos anos o Lucas tem?",o:["23","25","52"],a:1,e:"I'm twenty-five."},
    {q:"Como dizer “Tenho 30 anos”?",o:["I have 30 years.","I'm 30.","I'm have 30."],a:1,e:"Em inglês a idade vem com to be."},
    {q:"Qual negativa está certa?",o:["I don't American.","I'm not American.","I amn't American."],a:1,e:"Com to be, use not depois do verbo."},
    {q:"“Are you Brazilian?” Qual resposta está certa?",o:["Yes, I'm.","Yes, I am.","Yes, I are."],a:1,e:"Na resposta curta positiva não se contrai."}
  ],
  gaps:[
    {s:"___ you a new member?",a:["Are"],h:"Você é um membro novo?"},
    {s:"I'm ___ American.",a:["not"],h:"Não sou americano."},
    {s:"How ___ are you?",a:["old"],h:"Quantos anos você tem?"},
    {s:"She ___ British. She's Canadian.",a:["isn't","is not","'s not"],h:"Ela não é britânica. É canadense."},
    {s:"Are you Brazilian? — Yes, I ___.",a:["am"],h:"Você é brasileiro? — Sou."}
  ],
  order:[
    {t:["How","old","are","you?"],h:"Quantos anos você tem?"},
    {t:["Is","she","from","Canada?"],h:"Ela é do Canadá?"},
    {t:["I'm","not","a","teacher."],h:"Não sou professor."}
  ],
  dict:[{t:"How old are you?"},{t:"I'm not American."},{t:"thirteen"},{t:"thirty"},{t:"Is he Brazilian?"}],
  shadow:["Are you a new member?","How old are you?","No, I'm not. I'm Brazilian.","What's your phone number?"],
  write:{task:"Responda em inglês: What's your name? How old are you? Where are you from? Are you a student?",ph:"My name's … I'm …"},
  cards:[
    ["Quantos anos você tem?","How old are you?"],["Tenho 25 anos.","I'm twenty-five."],["Não sou americano.","I'm not American."],
    ["Você é brasileiro?","Are you Brazilian?"],["Sou, sim.","Yes, I am."],["Não, não sou.","No, I'm not."],
    ["Ela não é professora.","She isn't a teacher."],["Qual é o seu telefone?","What's your phone number?"]
  ]
},
/* ---------- 4 ---------- */
{
  title:"My family",
  goal:"Apresentar pessoas da família e dizer de quem é cada coisa.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Sarah mostra fotos da família no celular.",
  lines:[
    ["Lucas","Is this your family?","Esta é a sua família?"],
    ["Sarah","Yes! This is my mom, and this is my dad.","É! Esta é minha mãe, e este é meu pai."],
    ["Lucas","What's your mom's name?","Qual é o nome da sua mãe?"],
    ["Sarah","Her name's Linda. She's a nurse.","O nome dela é Linda. Ela é enfermeira."],
    ["Lucas","And who's this?","E quem é este?"],
    ["Sarah","That's my brother, Jake. His wife is Mexican.","Esse é meu irmão, Jake. A esposa dele é mexicana."],
    ["Lucas","And the two kids?","E as duas crianças?"],
    ["Sarah","They're Jake's kids. Their names are Mia and Leo.","São os filhos do Jake. Os nomes deles são Mia e Leo."],
    ["Lucas","Your family is beautiful!","Sua família é linda!"],
    ["Sarah","Thanks!","Obrigada!"]
  ],
  grammar:[
    {h:"Possessivos",
     p:["<b>my</b> (meu, minha), <b>your</b> (seu, sua), <b>his</b> (dele), <b>her</b> (dela), <b>our</b> (nosso), <b>their</b> (deles, delas). Eles não mudam com gênero nem número: <b>my brother</b>, <b>my sisters</b>."],
     ex:[["My mom is a nurse.","Minha mãe é enfermeira."],["Our parents are from Brazil.","Nossos pais são do Brasil."]],
     tip:"<b>His</b> e <b>her</b> dependem de quem é o <b>dono</b>, não da coisa. “A esposa dele” é <b>his wife</b>; “o marido dela” é <b>her husband</b>."},
    {h:"O 's de posse",
     p:["Para dizer “de alguém”, acrescente <b>'s</b> ao dono e inverta a ordem: “os filhos do Jake” vira <b>Jake's kids</b>."],
     ex:[["Jake's kids","os filhos do Jake"],["my mom's name","o nome da minha mãe"]],
     tip:"Evite “the kids of Jake”. Com pessoas, o natural é <b>Jake's kids</b>."},
    {h:"This is… para apresentar",
     p:["Para apresentar alguém ou mostrar numa foto, use <b>This is…</b> (para quem está perto) e <b>That's…</b> (para quem está mais longe)."],
     ex:[["This is my dad.","Este é meu pai."],["That's my brother.","Aquele é meu irmão."]]}
  ],
  vocab:[
    {h:"Família",items:[["mom","mãe"],["dad","pai"],["parents","pais"],["brother","irmão"],["sister","irmã"],["husband","marido"],["wife","esposa"],["son","filho"],["daughter","filha"],["kids","filhos, crianças"],["grandmother","avó"],["grandfather","avô"]]},
    {h:"Profissões da unidade",items:[["nurse","enfermeiro, enfermeira"],["doctor","médico, médica"]]}
  ],
  pron:[
    {h:"O o que soa “â”",p:"Em <b>mother</b>, <b>brother</b>, <b>son</b> e <b>mom</b> (americano), a vogal soa parecida com o “â” de “câmara”, não com o “o” de “bola”.",w:["brother","mother","son"]},
    {h:"daughter sem g",p:"O <b>gh</b> de <b>daughter</b> não é pronunciado: algo como “DÓ-ter”.",w:["daughter"]},
    {h:"O 's soa s ou z",p:"Depois de som surdo, como em <b>Jake's</b>, soa “s”. Depois de som sonoro, como em <b>mom's</b>, soa “z”.",w:["Jake's","mom's"]}
  ],
  mc:[
    {q:"Quem é a Linda?",o:["A mãe da Sarah","A irmã da Sarah","A esposa do Jake"],a:0,e:"Her name's Linda. She's a nurse."},
    {q:"Como dizer “a esposa dele”?",o:["his wife","her wife"],a:0,e:"O dono é homem, então his."},
    {q:"Como dizer “os filhos do Jake”?",o:["the kids of Jake","Jake's kids","Jake kids"],a:1,e:"Com pessoas, use 's."},
    {q:"Qual é a profissão da mãe da Sarah?",o:["teacher","doctor","nurse"],a:2,e:"She's a nurse."}
  ],
  gaps:[
    {s:"This is ___ sister.",a:["my"],h:"Esta é minha irmã."},
    {s:"___ name's Linda.",a:["Her"],h:"O nome dela é Linda."},
    {s:"___ wife is Mexican.",a:["His"],h:"A esposa dele é mexicana."},
    {s:"This is ___ car.",a:["Jake's"],h:"Este é o carro do Jake."},
    {s:"___ parents are from Canada.",a:["Our"],h:"Nossos pais são do Canadá."}
  ],
  order:[
    {t:["This","is","my","brother."],h:"Este é meu irmão."},
    {t:["Her","name's","Linda."],h:"O nome dela é Linda."},
    {t:["Their","names","are","Mia","and","Leo."],h:"Os nomes deles são Mia e Leo."}
  ],
  dict:[{t:"This is my dad."},{t:"His wife is Mexican."},{t:"Jake's kids"},{t:"daughter"}],
  shadow:["Is this your family?","This is my mom, and this is my dad.","Her name's Linda. She's a nurse.","They're Jake's kids."],
  write:{task:"Apresente 3 pessoas da sua família: quem são, o nome e a profissão ou de onde são.",ph:"This is my … Her name's …"},
  cards:[
    ["Esta é minha mãe.","This is my mom."],["O nome dele é Jake.","His name's Jake."],["A esposa dele é mexicana.","His wife is Mexican."],
    ["O marido dela é médico.","Her husband is a doctor."],["Os filhos do Jake.","Jake's kids."],["Qual é o nome do seu pai?","What's your dad's name?"],
    ["Nossos pais são do Brasil.","Our parents are from Brazil."],["Esta é a sua família?","Is this your family?"]
  ]
},
/* ---------- 5 ---------- */
{
  title:"Things around me",
  goal:"Nomear objetos, perguntar o que é algo e quanto custa.",
  speakers:{"Sarah":"f","Seller":"m"},
  setting:"Sarah está numa feira de rua em Londres e conversa com um vendedor.",
  lines:[
    ["Sarah","Excuse me, what's this?","Com licença, o que é isto?"],
    ["Seller","It's an umbrella. It's ten pounds.","É um guarda-chuva. Custa dez libras."],
    ["Sarah","And what are those?","E o que são aquelas?"],
    ["Seller","Those are bags. They're from Italy.","Aquelas são bolsas. São da Itália."],
    ["Sarah","How much are these watches?","Quanto custam estes relógios?"],
    ["Seller","They're twenty pounds each.","Custam vinte libras cada."],
    ["Sarah","Is that a map of London?","Aquilo é um mapa de Londres?"],
    ["Seller","Yes, it is. It's free!","É, sim. É de graça!"],
    ["Sarah","Great! A map and an umbrella, please.","Ótimo! Um mapa e um guarda-chuva, por favor."]
  ],
  grammar:[
    {h:"a ou an",
     p:["Use <b>a</b> antes de som de consoante e <b>an</b> antes de som de vogal: <b>a map</b>, <b>a bag</b>, <b>an umbrella</b>, <b>an apple</b>."],
     ex:[["a watch","um relógio"],["an umbrella","um guarda-chuva"]],
     tip:"Vale o <b>som</b>, não a letra: <b>a university</b> (começa com som de “iu”), <b>an hour</b> (o h é mudo)."},
    {h:"Plural",
     p:["Em geral, acrescente <b>-s</b>: bag → <b>bags</b>. Depois de -ch, -sh, -s e -x, acrescente <b>-es</b>: watch → <b>watches</b>, box → <b>boxes</b>.","Alguns são irregulares: man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, person → <b>people</b>."],
     ex:[["two bags","duas bolsas"],["three watches","três relógios"],["five people","cinco pessoas"]],
     tip:"O adjetivo nunca vai para o plural: <b>big bags</b>, não “bigs bags”."},
    {h:"this, that, these, those",
     p:["<b>this</b> (isto, este) e <b>these</b> (estes) para o que está perto. <b>that</b> (aquilo, aquele) e <b>those</b> (aqueles) para o que está longe."],
     ex:[["What's this?","O que é isto?"],["What are those?","O que são aqueles?"],["How much are these?","Quanto custam estes?"]]},
    {h:"Perguntando o preço",
     p:["Para uma coisa: <b>How much is it?</b> Para várias: <b>How much are they?</b>"],
     ex:[["How much is it? — It's ten pounds.","Quanto custa? — Dez libras."]]}
  ],
  vocab:[
    {h:"Objetos",items:[["bag","bolsa, sacola"],["umbrella","guarda-chuva"],["watch","relógio de pulso"],["phone","celular, telefone"],["key","chave"],["wallet","carteira"],["book","livro"],["pen","caneta"],["map","mapa"],["ticket","ingresso, passagem"]]},
    {h:"Comprando",items:[["Excuse me","com licença"],["How much is it?","quanto custa?"],["each","cada"],["free","grátis"],["expensive","caro"],["cheap","barato"]]}
  ],
  pron:[
    {h:"this ou these?",p:"<b>this</b> tem um i curto e termina em “s”. <b>these</b> tem um i longo e termina em “z”: “dhis” e “dhiiz”.",w:["this","these"]},
    {h:"O -es do plural",p:"Depois de -ch, -sh, -s e -x, o plural ganha uma sílaba: <b>watches</b> soa “uó-tchiz”.",w:["watches","boxes","buses"]},
    {h:"an se liga à palavra",p:"O n de <b>an</b> se junta à vogal seguinte: “a-nãm-BRÉ-la”.",w:["an umbrella","an apple"]}
  ],
  mc:[
    {q:"Quanto custa o guarda-chuva?",o:["£10","£20","É grátis"],a:0,e:"It's ten pounds."},
    {q:"___ umbrella",o:["a","an"],a:1,e:"umbrella começa com som de vogal."},
    {q:"Qual é o plural de watch?",o:["watchs","watches","watch"],a:1,e:"Depois de -ch, acrescente -es."},
    {q:"Como dizer “aquelas bolsas”?",o:["these bags","those bags"],a:1,e:"those = aqueles, longe e no plural."}
  ],
  gaps:[
    {s:"It's ___ umbrella.",a:["an"],h:"É um guarda-chuva."},
    {s:"___ is a map.",a:["This"],h:"Isto é um mapa."},
    {s:"Those are ___.",a:["bags"],h:"Aquelas são bolsas."},
    {s:"These ___ are expensive.",a:["watches"],h:"Estes relógios são caros."},
    {s:"There are five ___ here.",a:["people"],h:"Tem cinco pessoas aqui."}
  ],
  order:[
    {t:["What","are","those?"],h:"O que são aqueles?"},
    {t:["This","is","a","map","of","London."],h:"Isto é um mapa de Londres."},
    {t:["How","much","is","it?"],h:"Quanto custa?"}
  ],
  dict:[{t:"What's this?"},{t:"It's an umbrella."},{t:"these watches"},{t:"How much is it?"},{t:"people"}],
  shadow:["Excuse me, what's this?","It's an umbrella. It's ten pounds.","How much are these watches?","A map and an umbrella, please."],
  write:{task:"Descreva 4 objetos que estão perto de você agora, usando this, that, these ou those e a ou an.",ph:"This is a phone. Those are …"},
  cards:[
    ["O que é isto?","What's this?"],["É um guarda-chuva.","It's an umbrella."],["O que são aqueles?","What are those?"],
    ["Quanto custa?","How much is it?"],["Estes relógios são da Itália.","These watches are from Italy."],["Com licença.","Excuse me."],
    ["Duas pessoas.","Two people."],["É de graça!","It's free!"]
  ]
},
/* ---------- 6 ---------- */
{
  title:"My day",
  goal:"Contar a sua rotina, dizer as horas e perguntar sobre o dia de outra pessoa.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Antes da aula, Sarah repara que o Lucas está com sono.",
  lines:[
    ["Sarah","You look tired!","Você parece cansado!"],
    ["Lucas","I get up at six every day.","Eu acordo às seis todo dia."],
    ["Sarah","Six? Why?","Às seis? Por quê?"],
    ["Lucas","I work in the morning and I study in the afternoon.","Trabalho de manhã e estudo à tarde."],
    ["Sarah","What time do you have lunch?","A que horas você almoça?"],
    ["Lucas","At half past twelve. And you?","Ao meio-dia e meia. E você?"],
    ["Sarah","I don't work. I study in the morning and I go to the gym at night.","Eu não trabalho. Estudo de manhã e vou à academia à noite."],
    ["Lucas","Do you go to bed late?","Você vai dormir tarde?"],
    ["Sarah","No, I don't. I go to bed at ten.","Não. Vou dormir às dez."]
  ],
  grammar:[
    {h:"Present simple para a rotina",
     p:["Para hábitos e rotina, use o verbo na forma básica: <b>I work</b>, <b>you study</b>, <b>we go</b>, <b>they get up</b>. Com I, you, we e they o verbo não muda."],
     ex:[["I work in the morning.","Trabalho de manhã."],["We study English.","Estudamos inglês."]]},
    {h:"Negativa com don't",
     p:["Coloque <b>don't</b> (do not) antes do verbo: <b>I don't work</b>."],
     ex:[["I don't work on Sundays.","Não trabalho aos domingos."],["They don't eat meat.","Eles não comem carne."]],
     tip:"“I no work” e “I not work” estão errados. Sempre <b>I don't work</b>."},
    {h:"Pergunta com do",
     p:["Comece a pergunta com <b>Do</b>: <b>Do you work?</b> Respostas curtas: <b>Yes, I do.</b> <b>No, I don't.</b> Com palavras de pergunta: <b>What time do you get up?</b>"],
     ex:[["Do you go to the gym?","Você vai à academia?"],["What time do you have lunch?","A que horas você almoça?"]]},
    {h:"Horas e partes do dia",
     p:["<b>at</b> + hora: <b>at six</b>, <b>at half past twelve</b>. <b>in the morning</b>, <b>in the afternoon</b>, <b>in the evening</b>, mas <b>at night</b>."],
     ex:[["at seven o'clock","às sete em ponto"],["at a quarter past eight","às oito e quinze"],["at a quarter to nine","às quinze para as nove"]],
     tip:"Para perguntar as horas: <b>What time is it?</b> — <b>It's seven o'clock.</b>"}
  ],
  vocab:[
    {h:"Rotina",items:[["get up","levantar, acordar"],["have breakfast","tomar café da manhã"],["go to work","ir para o trabalho"],["have lunch","almoçar"],["study","estudar"],["go home","ir para casa"],["have dinner","jantar"],["go to bed","ir dormir"]]},
    {h:"Horas",items:[["seven o'clock","sete em ponto"],["half past seven","sete e meia"],["a quarter past seven","sete e quinze"],["a quarter to eight","quinze para as oito"],["every day","todo dia"],["late","tarde"],["early","cedo"]]}
  ],
  pron:[
    {h:"work ou walk?",p:"<b>work</b> soa algo como “uârk”. <b>walk</b> soa “uók”, com o l mudo.",w:["work","walk"]},
    {h:"o'clock",p:"Diz-se “ô-KLÓK”, com a força no fim.",w:["seven o'clock"]},
    {h:"Do you vira “d'you”",p:"Na fala rápida, <b>do you</b> fica bem curto: “d'iu”.",w:["Do you work?","What time do you get up?"]}
  ],
  mc:[
    {q:"A que horas o Lucas acorda?",o:["6h","7h","10h"],a:0,e:"I get up at six every day."},
    {q:"A Sarah trabalha?",o:["Sim","Não, ela só estuda"],a:1,e:"I don't work."},
    {q:"Qual negativa está certa?",o:["I no work.","I don't work.","I not work."],a:1,e:"Use don't antes do verbo."},
    {q:"Como dizer “à noite”?",o:["in the night","at night"],a:1,e:"Diz-se at night."}
  ],
  gaps:[
    {s:"I get ___ at six.",a:["up"],h:"Eu acordo às seis."},
    {s:"___ you work on Saturdays?",a:["Do"],h:"Você trabalha aos sábados?"},
    {s:"I ___ study at night.",a:["don't","do not"],h:"Eu não estudo à noite."},
    {s:"I have lunch ___ half past twelve.",a:["at"],h:"Almoço ao meio-dia e meia."},
    {s:"I study ___ the morning.",a:["in"],h:"Estudo de manhã."}
  ],
  order:[
    {t:["What","time","do","you","get","up?"],h:"A que horas você acorda?"},
    {t:["I","don't","work","on","Sundays."],h:"Não trabalho aos domingos."},
    {t:["We","go","to","bed","at","eleven."],h:"Vamos dormir às onze."}
  ],
  dict:[{t:"I get up at six."},{t:"Do you work?"},{t:"No, I don't."},{t:"half past twelve"},{t:"at night"}],
  shadow:["I get up at six every day.","I work in the morning and I study in the afternoon.","What time do you have lunch?","I go to bed at ten."],
  write:{task:"Descreva sua rotina em 4 ou 5 frases: a que horas acorda, trabalha ou estuda, almoça e vai dormir.",ph:"I get up at …"},
  cards:[
    ["Eu acordo às seis.","I get up at six."],["Você trabalha?","Do you work?"],["Não, não trabalho.","No, I don't."],
    ["Eu estudo à noite.","I study at night."],["A que horas você almoça?","What time do you have lunch?"],["Vou dormir às onze.","I go to bed at eleven."],
    ["Ao meio-dia e meia.","At half past twelve."],["Que horas são?","What time is it?"]
  ]
},
/* ---------- 7 ---------- */
{
  title:"Jobs",
  goal:"Falar da profissão e do trabalho de outras pessoas.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Sarah e Lucas conversam sobre os irmãos.",
  lines:[
    ["Sarah","What does your sister do?","O que a sua irmã faz?"],
    ["Lucas","She's a nurse. She works in a hospital.","Ela é enfermeira. Trabalha num hospital."],
    ["Sarah","Does she work at night?","Ela trabalha à noite?"],
    ["Lucas","Yes, she does. She starts at seven p.m.","Trabalha, sim. Começa às sete da noite."],
    ["Sarah","Wow. My brother is a chef.","Nossa. Meu irmão é chef de cozinha."],
    ["Lucas","Does he like his job?","Ele gosta do trabalho?"],
    ["Sarah","Yes, he loves it! But he doesn't have much free time.","Gosta, ele adora! Mas não tem muito tempo livre."],
    ["Lucas","Where does he work?","Onde ele trabalha?"],
    ["Sarah","In a restaurant in Toronto.","Num restaurante em Toronto."]
  ],
  grammar:[
    {h:"he, she, it: o verbo ganha -s",
     p:["No present simple, com <b>he</b>, <b>she</b> e <b>it</b> o verbo ganha <b>-s</b>: she <b>works</b>, he <b>likes</b>.","Alguns ganham <b>-es</b>: go → <b>goes</b>, watch → <b>watches</b>. Consoante + y vira <b>-ies</b>: study → <b>studies</b>. E have vira <b>has</b>."],
     ex:[["She works in a hospital.","Ela trabalha num hospital."],["He goes to work by bus.","Ele vai ao trabalho de ônibus."],["My sister has two kids.","Minha irmã tem dois filhos."]],
     tip:"Esquecer o -s é o erro mais comum do nível A1: “She work” está errado."},
    {h:"Negativa com doesn't",
     p:["Com he, she e it, use <b>doesn't</b> e o verbo volta para a forma básica, sem -s."],
     ex:[["He doesn't have free time.","Ele não tem tempo livre."],["She doesn't work on Sundays.","Ela não trabalha aos domingos."]],
     tip:"“He doesn't works” está errado: o -s já está no <b>doesn't</b>."},
    {h:"Pergunta com does",
     p:["<b>Does she work at night?</b> — <b>Yes, she does.</b> / <b>No, she doesn't.</b> Para perguntar a profissão: <b>What does he do?</b>"],
     ex:[["What does your sister do?","O que a sua irmã faz?"],["Where does he work?","Onde ele trabalha?"]]},
    {h:"a ou an antes da profissão",
     p:["Lembre-se: <b>She's a nurse</b>, <b>He's an engineer</b>. Use <b>an</b> quando a profissão começa com som de vogal."],
     ex:[["He's an engineer.","Ele é engenheiro."],["She's a lawyer.","Ela é advogada."]]}
  ],
  vocab:[
    {h:"Profissões",items:[["doctor","médico"],["nurse","enfermeiro"],["teacher","professor"],["engineer","engenheiro"],["lawyer","advogado"],["chef","chef de cozinha"],["salesperson","vendedor"],["developer","desenvolvedor"],["receptionist","recepcionista"]]},
    {h:"Lugares de trabalho",items:[["hospital","hospital"],["school","escola"],["office","escritório"],["restaurant","restaurante"],["store","loja"],["at home","em casa"]]}
  ],
  pron:[
    {h:"Três sons para o -s",p:"Depois de som surdo, soa “s”: <b>works</b>. Depois de som sonoro, “z”: <b>plays</b>. Depois de -ch, -sh, -s, ganha sílaba: <b>watches</b>.",w:["works","plays","watches"]},
    {h:"does soa “dâz”",p:"O o de <b>does</b> soa como “â”: “dâz”. E <b>doesn't</b> é “DÂ-zent”.",w:["does","doesn't"]},
    {h:"chef começa com “x”",p:"Em <b>chef</b>, o ch soa “x”, como em francês: “xéf”.",w:["chef"]}
  ],
  mc:[
    {q:"Onde a irmã do Lucas trabalha?",o:["Num hospital","Num restaurante","Numa escola"],a:0,e:"She works in a hospital."},
    {q:"Qual é a profissão do irmão da Sarah?",o:["nurse","chef","teacher"],a:1,e:"My brother is a chef."},
    {q:"Qual frase está certa?",o:["She work in a hospital.","She works in a hospital.","She working in a hospital."],a:1,e:"Com she, o verbo ganha -s."},
    {q:"Como dizer “Ele não tem tempo”?",o:["He doesn't has time.","He doesn't have time.","He don't have time."],a:1,e:"Depois de doesn't, o verbo fica sem -s."}
  ],
  gaps:[
    {s:"She ___ in a hospital.",a:["works"],h:"Ela trabalha num hospital."},
    {s:"___ he like his job?",a:["Does"],h:"Ele gosta do trabalho?"},
    {s:"He ___ work on Sundays.",a:["doesn't","does not"],h:"Ele não trabalha aos domingos."},
    {s:"What ___ she do?",a:["does"],h:"O que ela faz?"},
    {s:"My brother ___ two kids.",a:["has"],h:"Meu irmão tem dois filhos."}
  ],
  order:[
    {t:["What","does","your","sister","do?"],h:"O que a sua irmã faz?"},
    {t:["He","doesn't","work","at","night."],h:"Ele não trabalha à noite."},
    {t:["She","is","an","engineer."],h:"Ela é engenheira."}
  ],
  dict:[{t:"She works in a hospital."},{t:"Does he like his job?"},{t:"He doesn't have much free time."},{t:"an engineer"}],
  shadow:["What does your sister do?","She's a nurse. She works in a hospital.","Does he like his job?","In a restaurant in Toronto."],
  write:{task:"Escreva sobre 2 pessoas da sua família: a profissão, onde trabalham e o que fazem no dia a dia.",ph:"My sister is a … She works …"},
  cards:[
    ["O que ela faz?","What does she do?"],["Ela é enfermeira.","She's a nurse."],["Ele trabalha num escritório.","He works in an office."],
    ["Ela trabalha à noite?","Does she work at night?"],["Ele não gosta do trabalho.","He doesn't like his job."],["Minha irmã tem dois filhos.","My sister has two kids."],
    ["Ele é engenheiro.","He's an engineer."],["Ela estuda inglês.","She studies English."]
  ]
},
/* ---------- 8 ---------- */
{
  title:"Free time",
  goal:"Dizer do que você gosta e com que frequência faz cada coisa.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Sarah e Lucas conversam sobre o que fazem no tempo livre.",
  lines:[
    ["Lucas","What do you do in your free time?","O que você faz no tempo livre?"],
    ["Sarah","I love reading. I always read before bed.","Adoro ler. Sempre leio antes de dormir."],
    ["Lucas","Cool. Do you like sports?","Legal. Você gosta de esportes?"],
    ["Sarah","I like swimming, but I hate running!","Gosto de nadar, mas odeio correr!"],
    ["Lucas","Me too! I never run.","Eu também! Nunca corro."],
    ["Sarah","And you? What do you like doing?","E você? Do que você gosta de fazer?"],
    ["Lucas","I usually play video games on weekends.","Normalmente jogo videogame nos fins de semana."],
    ["Sarah","How often do you go to the movies?","Com que frequência você vai ao cinema?"],
    ["Lucas","Sometimes. Maybe once a month.","Às vezes. Talvez uma vez por mês."]
  ],
  grammar:[
    {h:"like, love, hate + -ing",
     p:["Depois de <b>like</b>, <b>love</b> e <b>hate</b>, o verbo costuma vir com <b>-ing</b>: <b>I like swimming</b>, <b>I hate running</b>."],
     ex:[["I love reading.","Adoro ler."],["Do you like cooking?","Você gosta de cozinhar?"]],
     tip:"Não existe o “de” do português: “I like of swimming” está errado."},
    {h:"Palavras de frequência",
     p:["<b>always</b> (sempre), <b>usually</b> (normalmente), <b>often</b> (frequentemente), <b>sometimes</b> (às vezes), <b>never</b> (nunca).","Elas vêm <b>antes</b> do verbo principal, mas <b>depois</b> do to be."],
     ex:[["I always read before bed.","Sempre leio antes de dormir."],["She's never late.","Ela nunca se atrasa."]],
     tip:"“I read always” está errado. O certo é <b>I always read</b>."},
    {h:"How often…?",
     p:["Para perguntar a frequência: <b>How often do you…?</b> Respostas: <b>every day</b>, <b>once a week</b> (uma vez por semana), <b>twice a month</b> (duas vezes por mês), <b>three times a year</b>."],
     ex:[["How often do you go to the gym?","Com que frequência você vai à academia?"],["Twice a week.","Duas vezes por semana."]]},
    {h:"Como escrever o -ing",
     p:["Em geral, só acrescente: read → <b>reading</b>. Se termina em -e, tire o e: dance → <b>dancing</b>. Se termina em consoante + vogal + consoante, dobre a última: run → <b>running</b>, swim → <b>swimming</b>."],
     ex:[["dancing","dançar"],["swimming","nadar"]]}
  ],
  vocab:[
    {h:"Atividades",items:[["reading","ler"],["swimming","nadar"],["running","correr"],["cooking","cozinhar"],["dancing","dançar"],["watching TV","ver TV"],["playing video games","jogar videogame"],["going to the movies","ir ao cinema"],["listening to music","ouvir música"]]},
    {h:"Frequência",items:[["always","sempre"],["usually","normalmente"],["often","frequentemente"],["sometimes","às vezes"],["never","nunca"],["once a week","uma vez por semana"],["twice a month","duas vezes por mês"],["on weekends","nos fins de semana"]]}
  ],
  pron:[
    {h:"O -ing não tem “gui”",p:"O final <b>-ing</b> é nasal, com o g quase mudo: “RÍ-din”, nunca “ríding-gui”.",w:["reading","swimming","running"]},
    {h:"often sem t",p:"Na maior parte dos falantes, o t de <b>often</b> é mudo: “Ó-fen”.",w:["often"]},
    {h:"usually",p:"Soa algo como “IÚ-ju-a-li”, com o s soando como o “j” de “jeito”.",w:["usually"]}
  ],
  mc:[
    {q:"O que a Sarah odeia?",o:["reading","swimming","running"],a:2,e:"I hate running!"},
    {q:"Com que frequência o Lucas vai ao cinema?",o:["Todo dia","Uma vez por mês","Nunca"],a:1,e:"Maybe once a month."},
    {q:"Qual frase está certa?",o:["I like of swimming.","I like swimming.","I like swim."],a:1,e:"like + -ing, sem “of”."},
    {q:"Qual frase está certa?",o:["I read always.","I always read."],a:1,e:"A frequência vem antes do verbo principal."}
  ],
  gaps:[
    {s:"I love ___.",a:["reading"],h:"Adoro ler."},
    {s:"I ___ run.",a:["never"],h:"Eu nunca corro."},
    {s:"How ___ do you go to the gym?",a:["often"],h:"Com que frequência você vai à academia?"},
    {s:"She ___ cooks.",a:["sometimes"],h:"Ela às vezes cozinha."},
    {s:"I go swimming ___ a week.",a:["once"],h:"Nado uma vez por semana."}
  ],
  order:[
    {t:["I","always","read","before","bed."],h:"Sempre leio antes de dormir."},
    {t:["Do","you","like","dancing?"],h:"Você gosta de dançar?"},
    {t:["We","sometimes","go","to","the","movies."],h:"Às vezes vamos ao cinema."}
  ],
  dict:[{t:"I love reading."},{t:"I hate running."},{t:"How often?"},{t:"once a month"},{t:"I usually play video games."}],
  shadow:["What do you do in your free time?","I like swimming, but I hate running!","How often do you go to the movies?","Sometimes. Maybe once a month."],
  write:{task:"Conte do que você gosta e não gosta de fazer no tempo livre, e com que frequência faz cada coisa.",ph:"I love … I usually …"},
  cards:[
    ["O que você faz no tempo livre?","What do you do in your free time?"],["Adoro ler.","I love reading."],["Odeio correr.","I hate running."],
    ["Nunca vou à academia.","I never go to the gym."],["Com que frequência?","How often?"],["Uma vez por semana.","Once a week."],
    ["Às vezes cozinho.","I sometimes cook."],["Eu também!","Me too!"]
  ]
},
/* ---------- 9 ---------- */
{
  title:"Food and drink",
  goal:"Pedir comida e bebida num café ou restaurante com educação.",
  speakers:{"Waiter":"m","Sarah":"f"},
  setting:"Sarah está num café em Toronto.",
  lines:[
    ["Waiter","Hi! Are you ready to order?","Oi! Já quer pedir?"],
    ["Sarah","Yes. Can I have a coffee, please?","Quero. Pode me ver um café, por favor?"],
    ["Waiter","Sure. With milk?","Claro. Com leite?"],
    ["Sarah","Yes, a little milk, please.","Sim, um pouco de leite, por favor."],
    ["Waiter","Anything to eat?","Algo para comer?"],
    ["Sarah","Do you have any sandwiches?","Vocês têm sanduíches?"],
    ["Waiter","Yes, we have some cheese sandwiches and some chicken sandwiches.","Temos, sim: sanduíches de queijo e de frango."],
    ["Sarah","I'd like a chicken sandwich, please.","Eu queria um sanduíche de frango, por favor."],
    ["Waiter","Here you are. That's eight dollars.","Aqui está. São oito dólares."],
    ["Sarah","Thanks!","Obrigada!"]
  ],
  grammar:[
    {h:"Contáveis e incontáveis",
     p:["Algumas coisas se contam: <b>a sandwich</b>, <b>two sandwiches</b>. Outras não: <b>milk</b>, <b>water</b>, <b>bread</b>, <b>cheese</b>. As incontáveis não têm plural nem <b>a</b>."],
     ex:[["an egg, two eggs","um ovo, dois ovos"],["some bread","pão (um pouco)"]],
     tip:"No café, <b>a coffee</b> e <b>two coffees</b> são normais: quer dizer uma xícara, duas xícaras."},
    {h:"some e any",
     p:["<b>some</b> em frases afirmativas: <b>We have some sandwiches</b>. <b>any</b> em perguntas e negativas: <b>Do you have any juice?</b> <b>We don't have any milk.</b>"],
     ex:[["I'd like some water.","Eu queria água."],["Do you have any tea?","Vocês têm chá?"]],
     tip:"Para oferecer ou pedir algo, também se usa <b>some</b> na pergunta: <b>Would you like some coffee?</b>"},
    {h:"Pedindo com educação",
     p:["<b>Can I have…, please?</b> e <b>I'd like…</b> (I would like) são as formas normais de pedir."],
     ex:[["Can I have the check, please?","Pode me trazer a conta, por favor?"],["I'd like a tea.","Eu queria um chá."]],
     tip:"<b>I want a coffee</b> soa seco e mal-educado num restaurante."}
  ],
  vocab:[
    {h:"Comida",items:[["bread","pão"],["cheese","queijo"],["chicken","frango"],["salad","salada"],["sandwich","sanduíche"],["egg","ovo"],["rice","arroz"],["beans","feijão"],["fruit","fruta"]]},
    {h:"Bebidas e frases",items:[["water","água"],["coffee","café"],["tea","chá"],["milk","leite"],["juice","suco"],["Can I have…?","pode me ver…?"],["I'd like…","eu queria…"],["The check, please.","a conta, por favor"],["Here you are.","aqui está"]]}
  ],
  pron:[
    {h:"I'd like",p:"O d de <b>I'd</b> quase some: “aid laik”.",w:["I'd like a coffee"]},
    {h:"water americano",p:"No inglês americano, o t entre vogais vira um “r” rápido, como em “caro”: “UÓ-rer”.",w:["water","better"]},
    {h:"chicken e cheese",p:"O ch soa “tch”. <b>chicken</b> tem i curto; <b>cheese</b> tem i longo e termina em “z”.",w:["chicken","cheese"]}
  ],
  mc:[
    {q:"O que a Sarah pede para comer?",o:["Sanduíche de queijo","Sanduíche de frango","Salada"],a:1,e:"I'd like a chicken sandwich."},
    {q:"Quanto ela paga?",o:["$8","$18","$80"],a:0,e:"That's eight dollars."},
    {q:"Qual pergunta está certa?",o:["Do you have some sandwiches?","Do you have any sandwiches?"],a:1,e:"Em perguntas comuns, use any."},
    {q:"Qual pedido é mais educado?",o:["I want a coffee.","Can I have a coffee, please?"],a:1,e:"Can I have…, please? é o padrão."}
  ],
  gaps:[
    {s:"Can I ___ a coffee, please?",a:["have"],h:"Pode me ver um café, por favor?"},
    {s:"Do you have ___ sandwiches?",a:["any"],h:"Vocês têm sanduíches?"},
    {s:"We have ___ cheese sandwiches.",a:["some"],h:"Temos sanduíches de queijo."},
    {s:"I'd ___ a tea, please.",a:["like"],h:"Eu queria um chá, por favor."},
    {s:"___ you are.",a:["Here"],h:"Aqui está."}
  ],
  order:[
    {t:["Can","I","have","a","coffee,","please?"],h:"Pode me ver um café, por favor?"},
    {t:["I'd","like","a","chicken","sandwich."],h:"Eu queria um sanduíche de frango."},
    {t:["We","don't","have","any","milk."],h:"Não temos leite."}
  ],
  dict:[{t:"Can I have a coffee, please?"},{t:"I'd like some water."},{t:"Do you have any juice?"},{t:"Here you are."}],
  shadow:["Are you ready to order?","Can I have a coffee, please?","Do you have any sandwiches?","I'd like a chicken sandwich, please."],
  write:{task:"Você está num café. Escreva o seu lado do diálogo: o que quer beber e comer, e peça a conta.",ph:"Can I have …"},
  cards:[
    ["Pode me ver um café, por favor?","Can I have a coffee, please?"],["Eu queria um sanduíche.","I'd like a sandwich."],["Vocês têm suco?","Do you have any juice?"],
    ["Não temos leite.","We don't have any milk."],["Aqui está.","Here you are."],["A conta, por favor.","The check, please."],
    ["Um pouco de água.","Some water."],["Algo para comer?","Anything to eat?"]
  ]
},
/* ---------- 10 ---------- */
{
  title:"My city",
  goal:"Perguntar o que tem num lugar, descrever onde fica e entender direções.",
  speakers:{"Lucas":"m","Kate":"f"},
  setting:"Lucas precisa de uma farmácia e pede ajuda a uma moradora, a Kate.",
  lines:[
    ["Lucas","Excuse me. Is there a pharmacy near here?","Com licença. Tem uma farmácia aqui perto?"],
    ["Kate","Yes, there is. It's on Main Street.","Tem, sim. Fica na Main Street."],
    ["Lucas","How do I get there?","Como eu chego lá?"],
    ["Kate","Go straight and turn left at the bank.","Siga reto e vire à esquerda no banco."],
    ["Lucas","Turn left at the bank. OK.","À esquerda no banco. Certo."],
    ["Kate","The pharmacy is next to a café, opposite the park.","A farmácia fica ao lado de um café, em frente ao parque."],
    ["Lucas","Are there any supermarkets on that street?","Tem supermercados nessa rua?"],
    ["Kate","Yes, there are two.","Tem, sim, dois."],
    ["Lucas","Great, thank you!","Ótimo, obrigado!"],
    ["Kate","You're welcome!","De nada!"]
  ],
  grammar:[
    {h:"There is e there are",
     p:["Para dizer que algo existe num lugar, use <b>there is</b> (singular) e <b>there are</b> (plural). É o “tem” e o “há” do português."],
     ex:[["There's a park near my house.","Tem um parque perto da minha casa."],["There are two banks.","Tem dois bancos."]],
     tip:"“Have a park here” está errado. O certo é <b>There's a park here</b>."},
    {h:"Perguntas e negativas",
     p:["Pergunta: <b>Is there…?</b> / <b>Are there any…?</b> Negativa: <b>There isn't…</b> / <b>There aren't any…</b>"],
     ex:[["Is there a bank near here?","Tem um banco aqui perto?"],["There aren't any hotels.","Não tem hotéis."]]},
    {h:"Onde fica",
     p:["<b>next to</b> (ao lado de), <b>opposite</b> (em frente a), <b>between</b> (entre), <b>near</b> (perto de), <b>on the corner</b> (na esquina). Para ruas, <b>on</b>: on Main Street. Para cidades, <b>in</b>: in London."],
     ex:[["It's next to the bank.","Fica ao lado do banco."],["It's between the café and the hotel.","Fica entre o café e o hotel."]]},
    {h:"Dando direções",
     p:["<b>Go straight</b> (siga reto), <b>turn left</b> (vire à esquerda), <b>turn right</b> (vire à direita), <b>it's on the left</b> (fica à esquerda)."],
     ex:[["Turn right at the park.","Vire à direita no parque."],["It's on the left.","Fica à esquerda."]]}
  ],
  vocab:[
    {h:"Lugares",items:[["bank","banco"],["pharmacy","farmácia"],["supermarket","supermercado"],["park","parque"],["bus stop","ponto de ônibus"],["subway station","estação de metrô"],["hotel","hotel"],["museum","museu"],["street","rua"]]},
    {h:"Direções",items:[["go straight","siga reto"],["turn left","vire à esquerda"],["turn right","vire à direita"],["next to","ao lado de"],["opposite","em frente a"],["between","entre"],["near","perto de"],["far","longe"]]}
  ],
  pron:[
    {h:"there's e there are",p:"O th vibra, como em <b>the</b>. Em <b>there are</b>, as palavras se ligam: “dhé-rar”.",w:["there's","there are"]},
    {h:"straight sem g",p:"<b>straight</b> soa “strêit”: o gh é mudo.",w:["straight"]},
    {h:"O r inglês",p:"Em <b>right</b>, a língua não toca o céu da boca: ela se curva um pouco para trás.",w:["right","street"]}
  ],
  mc:[
    {q:"Onde fica a farmácia?",o:["Ao lado de um café","Ao lado do banco","Entre dois parques"],a:0,e:"next to a café, opposite the park."},
    {q:"Onde o Lucas deve virar?",o:["À esquerda no banco","À direita no parque"],a:0,e:"turn left at the bank."},
    {q:"Como dizer “Tem um parque aqui?”",o:["Have a park here?","Is there a park here?"],a:1,e:"Use Is there…?"},
    {q:"Como dizer “Tem dois bancos”?",o:["There is two banks.","There are two banks."],a:1,e:"No plural, there are."}
  ],
  gaps:[
    {s:"___ there a bank near here?",a:["Is"],h:"Tem um banco aqui perto?"},
    {s:"There ___ two supermarkets.",a:["are"],h:"Tem dois supermercados."},
    {s:"Turn ___ at the bank.",a:["left"],h:"Vire à esquerda no banco."},
    {s:"It's next ___ the café.",a:["to"],h:"Fica ao lado do café."},
    {s:"Go ___.",a:["straight"],h:"Siga reto."}
  ],
  order:[
    {t:["Is","there","a","pharmacy","near","here?"],h:"Tem uma farmácia aqui perto?"},
    {t:["Turn","right","at","the","park."],h:"Vire à direita no parque."},
    {t:["The","bank","is","opposite","the","hotel."],h:"O banco fica em frente ao hotel."}
  ],
  dict:[{t:"Is there a bank near here?"},{t:"Turn left."},{t:"Go straight."},{t:"next to the café"},{t:"You're welcome."}],
  shadow:["Is there a pharmacy near here?","How do I get there?","Go straight and turn left at the bank.","You're welcome!"],
  write:{task:"Descreva o seu bairro: o que tem perto da sua casa e onde fica cada lugar.",ph:"There's a … near my house. It's next to …"},
  cards:[
    ["Tem uma farmácia aqui perto?","Is there a pharmacy near here?"],["Como eu chego lá?","How do I get there?"],["Siga reto.","Go straight."],
    ["Vire à esquerda.","Turn left."],["Fica ao lado do banco.","It's next to the bank."],["Em frente ao parque.","Opposite the park."],
    ["Tem dois supermercados.","There are two supermarkets."],["De nada.","You're welcome."]
  ]
},
/* ---------- 11 ---------- */
{
  title:"I can do it",
  goal:"Dizer o que você sabe e não sabe fazer, e pedir permissão ou ajuda.",
  speakers:{"Emma":"f","Lucas":"m"},
  setting:"Lucas quer ser voluntário num festival. Emma, a organizadora, faz algumas perguntas.",
  lines:[
    ["Emma","So, Lucas, can you speak Spanish?","Então, Lucas, você fala espanhol?"],
    ["Lucas","Yes, I can. A little.","Falo, sim. Um pouco."],
    ["Emma","Can you drive?","Você sabe dirigir?"],
    ["Lucas","No, I can't. But I can ride a bike.","Não sei. Mas sei andar de bicicleta."],
    ["Emma","That's fine. Can you work on Saturday?","Tudo bem. Você pode trabalhar no sábado?"],
    ["Lucas","Yes, I can. Can I bring a friend?","Posso, sim. Posso levar um amigo?"],
    ["Emma","Of course! Can he cook?","Claro! Ele sabe cozinhar?"],
    ["Lucas","Yes, he can. He's a great cook!","Sabe, sim. Ele cozinha muito bem!"],
    ["Emma","Perfect. See you on Saturday!","Perfeito. Até sábado!"]
  ],
  grammar:[
    {h:"can: saber, conseguir, poder",
     p:["<b>can</b> serve para habilidade (saber, conseguir) e para possibilidade ou permissão (poder). Depois dele vem o verbo na forma básica, sem <b>to</b>.","<b>can</b> nunca muda: <b>I can</b>, <b>she can</b>, <b>they can</b>."],
     ex:[["I can swim.","Eu sei nadar."],["She can speak three languages.","Ela fala três línguas."]],
     tip:"“She cans” e “I can to swim” estão errados."},
    {h:"Negativa e pergunta",
     p:["Negativa: <b>can't</b> (cannot). Pergunta: <b>Can you…?</b> Respostas curtas: <b>Yes, I can.</b> <b>No, I can't.</b>"],
     ex:[["I can't drive.","Não sei dirigir."],["Can he cook? — Yes, he can.","Ele sabe cozinhar? — Sabe."]]},
    {h:"Pedidos e permissão",
     p:["<b>Can I…?</b> pede permissão. <b>Can you…?</b> pede um favor."],
     ex:[["Can I come in?","Posso entrar?"],["Can you help me?","Você pode me ajudar?"],["Can you speak slowly, please?","Pode falar devagar, por favor?"]]}
  ],
  vocab:[
    {h:"Habilidades",items:[["speak English","falar inglês"],["drive","dirigir"],["cook","cozinhar"],["swim","nadar"],["dance","dançar"],["sing","cantar"],["play the guitar","tocar violão"],["ride a bike","andar de bicicleta"],["use a computer","usar o computador"]]},
    {h:"Pedidos úteis",items:[["Can I come in?","posso entrar?"],["Can you help me?","pode me ajudar?"],["Can you repeat, please?","pode repetir, por favor?"],["Can you speak slowly, please?","pode falar devagar, por favor?"],["Of course!","claro!"]]}
  ],
  pron:[
    {h:"can ou can't?",p:"Na frase, <b>can</b> é fraco e rápido: “kãn”. <b>can't</b> é forte, com vogal aberta, e o t final quase some. A diferença está na força, não no t.",w:["I can swim.","I can't swim."]},
    {h:"guitar",p:"A força cai no fim: gi-TAR.",w:["guitar"]}
  ],
  mc:[
    {q:"O Lucas sabe dirigir?",o:["Sim","Não"],a:1,e:"No, I can't."},
    {q:"O que o amigo do Lucas sabe fazer bem?",o:["Dirigir","Cozinhar","Dançar"],a:1,e:"He's a great cook!"},
    {q:"Qual frase está certa?",o:["She can to swim.","She can swim.","She cans swim."],a:1,e:"can + verbo básico, sem to e sem -s."},
    {q:"Como pedir para alguém falar devagar?",o:["Can you speak slowly, please?","You can speak slowly?"],a:0,e:"Pergunta com can: Can you…?"}
  ],
  gaps:[
    {s:"___ you drive?",a:["Can"],h:"Você sabe dirigir?"},
    {s:"I ___ swim.",a:["can't","cannot","can not"],h:"Não sei nadar."},
    {s:"He can ___ very well.",a:["cook"],h:"Ele cozinha muito bem."},
    {s:"___ I come in?",a:["Can"],h:"Posso entrar?"},
    {s:"Can you ___, please?",a:["repeat"],h:"Pode repetir, por favor?"}
  ],
  order:[
    {t:["Can","you","help","me?"],h:"Você pode me ajudar?"},
    {t:["I","can't","drive."],h:"Não sei dirigir."},
    {t:["She","can","speak","three","languages."],h:"Ela fala três línguas."}
  ],
  dict:[{t:"Can you drive?"},{t:"No, I can't."},{t:"Can I come in?"},{t:"Can you speak slowly, please?"},{t:"He can cook."}],
  shadow:["Can you speak Spanish?","No, I can't. But I can ride a bike.","Can I bring a friend?","Can you speak slowly, please?"],
  write:{task:"Escreva o que você sabe e não sabe fazer: pelo menos 3 de cada.",ph:"I can … I can't …"},
  cards:[
    ["Você sabe dirigir?","Can you drive?"],["Não sei nadar.","I can't swim."],["Posso entrar?","Can I come in?"],
    ["Você pode me ajudar?","Can you help me?"],["Pode repetir, por favor?","Can you repeat, please?"],["Pode falar devagar?","Can you speak slowly, please?"],
    ["Ela fala três línguas.","She can speak three languages."],["Sei tocar violão.","I can play the guitar."]
  ]
},
/* ---------- 12 ---------- */
{
  title:"Right now",
  goal:"Contar o que está acontecendo agora, falar do tempo e das roupas.",
  speakers:{"Sarah":"f","Lucas":"m"},
  setting:"Sarah faz uma chamada de vídeo para o Lucas.",
  lines:[
    ["Sarah","Hi, Lucas! What are you doing?","Oi, Lucas! O que você está fazendo?"],
    ["Lucas","I'm cooking dinner. What about you?","Estou fazendo o jantar. E você?"],
    ["Sarah","I'm walking in the park. It's sunny today!","Estou caminhando no parque. Está sol hoje!"],
    ["Lucas","Lucky you! It's raining here.","Que sorte! Aqui está chovendo."],
    ["Sarah","Oh no! Is it cold?","Ah, não! Está frio?"],
    ["Lucas","Yes, it is. I'm wearing a big sweater.","Está. Estou com um suéter grosso."],
    ["Sarah","Are your roommates home?","Seus colegas de apartamento estão em casa?"],
    ["Lucas","Yes, they're watching a movie in the living room.","Estão, estão vendo um filme na sala."],
    ["Sarah","OK, have fun. Talk to you later!","Beleza, divirta-se. Falo com você depois!"]
  ],
  grammar:[
    {h:"Present continuous: o que acontece agora",
     p:["Para o que está acontecendo neste momento, use <b>am, is, are</b> + verbo com <b>-ing</b>: <b>I'm cooking</b>, <b>she's walking</b>, <b>they're watching</b>."],
     ex:[["I'm cooking dinner.","Estou fazendo o jantar."],["They're watching a movie.","Eles estão vendo um filme."]],
     tip:"Não esqueça o verbo to be: “I cooking” está errado."},
    {h:"Pergunta e negativa",
     p:["Pergunta: troque a ordem: <b>What are you doing?</b> <b>Is she working?</b> Negativa: <b>I'm not</b>, <b>she isn't</b>, <b>they aren't</b> + -ing."],
     ex:[["Is it raining?","Está chovendo?"],["She isn't working today.","Ela não está trabalhando hoje."]]},
    {h:"Rotina ou agora?",
     p:["Present simple para hábitos: <b>I work every day</b>. Present continuous para agora: <b>I'm working now</b>."],
     ex:[["I usually walk to work.","Normalmente vou a pé ao trabalho."],["I'm taking the bus today.","Hoje estou indo de ônibus."]]},
    {h:"Falando do tempo",
     p:["O tempo sempre começa com <b>It's</b>: <b>It's sunny</b>, <b>It's cold</b>, <b>It's raining</b>."],
     ex:[["It's hot today.","Está quente hoje."],["It's snowing!","Está nevando!"]],
     tip:"“Is raining” está errado: o inglês exige o <b>it</b>."}
  ],
  vocab:[
    {h:"Tempo",items:[["sunny","ensolarado"],["cloudy","nublado"],["raining","chovendo"],["snowing","nevando"],["windy","ventando"],["hot","quente"],["cold","frio"],["warm","morno, agradável"]]},
    {h:"Roupas",items:[["T-shirt","camiseta"],["jeans","calça jeans"],["sweater","suéter, blusa de frio"],["jacket","jaqueta"],["dress","vestido"],["shoes","sapatos"],["sneakers","tênis"],["coat","casaco"]]}
  ],
  pron:[
    {h:"sweater",p:"O <b>ea</b> soa “é”: “SUÉ-ter” (no americano, “SUÉ-rer”).",w:["sweater"]},
    {h:"clothes",p:"Palavra difícil até para nativos: soa quase “clouz”.",w:["clothes"]},
    {h:"cold ou called?",p:"<b>cold</b> tem um “ou” fechado: “kould”. <b>called</b> tem um “ó” aberto: “kóld”.",w:["cold","called"]}
  ],
  mc:[
    {q:"O que o Lucas está fazendo?",o:["Cozinhando","Caminhando","Vendo um filme"],a:0,e:"I'm cooking dinner."},
    {q:"Como está o tempo onde a Sarah está?",o:["Ensolarado","Chuvoso","Nevando"],a:0,e:"It's sunny today!"},
    {q:"Qual frase está certa?",o:["I cooking dinner.","I'm cooking dinner."],a:1,e:"Precisa do to be: I'm."},
    {q:"Como dizer “Está chovendo”?",o:["Is raining.","It's raining."],a:1,e:"Para falar do clima, use it: It's raining."}
  ],
  gaps:[
    {s:"What are you ___?",a:["doing"],h:"O que você está fazendo?"},
    {s:"It's ___ here.",a:["raining"],h:"Aqui está chovendo."},
    {s:"She ___ working now.",a:["is","'s"],h:"Ela está trabalhando agora."},
    {s:"They ___ watching a movie.",a:["are","'re"],h:"Eles estão vendo um filme."},
    {s:"I'm ___ a sweater.",a:["wearing"],h:"Estou usando um suéter."}
  ],
  order:[
    {t:["What","are","you","doing?"],h:"O que você está fazendo?"},
    {t:["It's","raining","here."],h:"Aqui está chovendo."},
    {t:["She's","wearing","a","jacket."],h:"Ela está usando uma jaqueta."}
  ],
  dict:[{t:"What are you doing?"},{t:"It's sunny today."},{t:"I'm cooking dinner."},{t:"They're watching a movie."},{t:"sweater"}],
  shadow:["What are you doing?","I'm walking in the park. It's sunny today!","It's raining here.","Talk to you later!"],
  write:{task:"Descreva este momento: o que você está fazendo, como está o tempo e que roupa está usando.",ph:"Right now I'm … It's …"},
  cards:[
    ["O que você está fazendo?","What are you doing?"],["Estou fazendo o jantar.","I'm cooking dinner."],["Está chovendo.","It's raining."],
    ["Está sol hoje.","It's sunny today."],["Está frio?","Is it cold?"],["Estou usando um suéter.","I'm wearing a sweater."],
    ["Eles estão vendo um filme.","They're watching a movie."],["Falo com você depois!","Talk to you later!"]
  ]
}
];
