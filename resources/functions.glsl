struct MyFancyDataStructure{
  int a; // scoreboard objective create MyFancyDataStructure$a dummy
  int b; 
  int c;
  d: {
    int d1; // scoreboard objective create MyFancyDataStructure$d$d1 dummy
    int d2;
  }
}

void main(){
  ScoreHolder var = selector("all_players",{
    "limit":1
  })
  # /scoreboard players set $var 0
}