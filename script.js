var $=function(i){return document.getElementById(i)};
var lang="en";
try{if(localStorage.getItem("lang")==="pt")lang="pt"}catch(e){}
function t(en,pt){return lang==="pt"?pt:en}

/* data: followers on main platform, in millions (rounded estimates) */
var P=[["Cristiano Ronaldo","Instagram",660],["Lionel Messi","Instagram",510],["MrBeast","YouTube",450],["Selena Gomez","Instagram",420],["Kylie Jenner","Instagram",395],["Dwayne Johnson","Instagram",395],["Ariana Grande","Instagram",370],["Kim Kardashian","Instagram",355],["Beyoncé","Instagram",315],["Justin Bieber","Instagram",290],["Taylor Swift","Instagram",280],["Virat Kohli","Instagram",270],["Neymar","Instagram",225],["Khaby Lame","TikTok",160],["Charli D'Amelio","TikTok",155],["PewDiePie","YouTube",110]];
var fm=[
["YouTube launched before Instagram.","O YouTube foi lançado antes do Instagram.",true,"YouTube is from 2005, Instagram from 2010.","O YouTube é de 2005 e o Instagram de 2010."],
["TikTok was created in 2005.","O TikTok foi criado em 2005.",false,"TikTok grew worldwide around 2016–2018.","O TikTok cresceu em todo o mundo por volta de 2016–2018."],
["In many countries, paid posts must be clearly marked as ads.","Em muitos países, as publicações pagas têm de estar claramente identificadas como publicidade.",true,"Hidden ads can break advertising rules.","A publicidade escondida pode violar as regras da publicidade."],
["Khaby Lame became famous with silent reaction videos.","O Khaby Lame ficou famoso com vídeos de reação sem falar.",true,"His wordless style made him popular in every language.","O estilo sem palavras tornou-o popular em todas as línguas."],
["The biggest accounts have more followers than most countries have people.","As maiores contas têm mais seguidores do que a população da maioria dos países.",true,"Hundreds of millions beats almost every country.","Centenas de milhões ganham à população de quase todos os países."],
["All influencers are adults.","Todos os influenciadores são adultos.",false,"Many creators are teenagers, and some are even kids.","Muitos criadores são adolescentes e alguns são mesmo crianças."]
];

/* translator: swaps every text with data-en / data-pt */
function apply(){
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-en]").forEach(function(e){e.innerHTML=e.dataset[lang]});
 $("lang").textContent=lang==="en"?"PT 🇵🇹":"EN 🇬🇧";
 document.title=t("Influencers – Media Presentation","Influenciadores – Apresentação de Media");
 hearts();showQ();if(over)endMsg();
}
$("lang").onclick=function(){
 lang=lang==="en"?"pt":"en";
 try{localStorage.setItem("lang",lang)}catch(e){}
 apply();
};

/* hero like button */
var likes=0;
$("like").onclick=function(){likes++;$("likes").textContent=likes};

/* initials circle for the ranking */
function ph(n){
 var ini=(n.match(/[A-Z]/g)||[n[0]]).slice(0,2).join("");
 return "<span class='ph'><b>"+ini+"</b></span>";
}
/* ranking bars */
var tp=P.slice().sort(function(a,b){return b[2]-a[2]}).slice(0,8);
$("bars").innerHTML=tp.map(function(d,i){return "<div class='bar'><span class='n'>"+(i+1)+"</span>"+ph(d[0])+"<div><div class='t'><span>"+d[0]+" <small>"+d[1]+"</small></span><span>"+d[2]+" M</span></div><div class='f' data-w='"+Math.round(d[2]/tp[0][2]*100)+"'></div></div></div>"}).join("");
var seen=false;
new IntersectionObserver(function(en,ob){
 if(en[0].isIntersecting&&!seen){seen=true;document.querySelectorAll(".f").forEach(function(f){f.style.width=f.dataset.w+"%"});ob.disconnect()}
}).observe($("bars"));

/* tabs */
document.querySelectorAll(".tab").forEach(function(b){
 b.onclick=function(){
  document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("on",x===b)});
  $("hl").hidden=b.dataset.g!=="hl";$("fm").hidden=b.dataset.g!=="fm";
 };
});

/* game 1: higher or lower, close pairs only */
var A,B,score=0,best=0,lives=3,over=false,timer=null,left=10;
function mk(){
 var a,b,tries=0;
 do{a=P[Math.floor(Math.random()*P.length)];b=P[Math.floor(Math.random()*P.length)];tries++}
 while((a===b||Math.min(a[2],b[2])/Math.max(a[2],b[2])<0.82)&&tries<500);
 A=a;B=b;
}
function hearts(){$("lv").textContent=new Array(lives+1).join("❤️")+new Array(4-lives).join("🖤")}
function round(){
 mk();
 $("aN").textContent=A[0];$("aP").textContent=A[1];$("aV").textContent=A[2]+" M";
 $("bN").textContent=B[0];$("bP").textContent=B[1];$("bV").textContent="?";
 $("hi").disabled=$("lo").disabled=false;$("msg").textContent="";$("again").hidden=true;
 left=10;clearInterval(timer);
 timer=setInterval(function(){
  left-=0.1;$("tm").style.width=Math.max(left,0)*10+"%";
  if(left<=0)answer(null);
 },100);
}
function endMsg(){$("msg").textContent=t("Game over! Final score: ","Fim do jogo! Pontuação final: ")+score;$("again").hidden=false}
function answer(more){
 clearInterval(timer);
 $("hi").disabled=$("lo").disabled=true;$("bV").textContent=B[2]+" M";
 var gap=Math.round(Math.abs(B[2]-A[2])/Math.max(A[2],B[2])*100);
 var ok=more!==null&&(more?B[2]>=A[2]:B[2]<=A[2]);
 if(ok){
  score++;$("sc").textContent=score;
  if(score>best){best=score;$("bs").textContent=best}
  $("msg").textContent=t("Correct! Only "+gap+"% apart.","Certo! Só "+gap+"% de diferença.");
 }else{
  lives--;hearts();
  $("msg").textContent=more===null?t("Time's up!","Acabou o tempo!"):t("Wrong! Only "+gap+"% apart.","Errado! Só "+gap+"% de diferença.");
 }
 if(lives<=0){over=true;setTimeout(endMsg,1400)}
 else setTimeout(round,1600);
}
$("hi").onclick=function(){answer(true)};
$("lo").onclick=function(){answer(false)};
$("again").onclick=function(){score=0;lives=3;over=false;$("sc").textContent=0;hearts();round()};

/* game 2: fact or myth */
var qi=0,qs=0,locked=false;
function showQ(){
 if(qi>=fm.length){
  $("qt").textContent=t("Done! Score: "+qs+"/"+fm.length,"Terminado! Pontos: "+qs+"/"+fm.length);
  $("fact").hidden=$("myth").hidden=true;$("next").hidden=false;
  $("next").textContent=t("Play again","Jogar outra vez");return;
 }
 $("qn").textContent=qi+1;$("qs").textContent=qs;
 $("qt").textContent=fm[qi][lang==="pt"?1:0];
 $("fact").hidden=$("myth").hidden=false;
 if(!locked){$("qmsg").textContent="";$("next").hidden=true}
 else{$("qmsg").textContent=lastMsg()}
}
var lastRes=null;
function lastMsg(){var q=fm[qi];return (lastRes?t("Correct! ","Certo! "):t("Not quite. ","Quase. "))+q[lang==="pt"?4:3]}
function pickQ(v){
 if(locked)return;
 locked=true;lastRes=(v===fm[qi][2]);if(lastRes)qs++;
 $("qs").textContent=qs;$("qmsg").textContent=lastMsg();
 $("next").hidden=false;$("next").textContent=t("Next","Seguinte");
}
$("fact").onclick=function(){pickQ(true)};
$("myth").onclick=function(){pickQ(false)};
$("next").onclick=function(){
 if(qi>=fm.length){qi=0;qs=0}else qi++;
 locked=false;showQ();
};

round();apply();
