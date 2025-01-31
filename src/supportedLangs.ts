import { KnownLanguages, Languages, SupportedLanguages } from '~/types'

export const supportedLangs: SupportedLanguages = {
  ABAP: ['abap'],
  ABC: ['abc'],
  ActionScript: ['as'],
  ADA: ['ada|adb'],
  Alda: ['alda'],
  Apache_Conf: ['^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd'],
  Apex: ['apex|cls|trigger|tgr'],
  AQL: ['aql'],
  AsciiDoc: ['asciidoc|adoc'],
  ASL: ['dsl|asl'],
  Assembly_x86: ['asm|a'],
  AutoHotKey: ['ahk'],
  BatchFile: ['bat|cmd'],
  C_Cpp: ['cpp|c|cc|cxx|h|hh|hpp|ino'],
  C9Search: ['c9search_results'],
  Cirru: ['cirru|cr'],
  Clojure: ['clj|cljs'],
  Cobol: ['CBL|COB'],
  coffee: ['coffee|cf|cson|^Cakefile'],
  ColdFusion: ['cfm'],
  Crystal: ['cr'],
  CSharp: ['cs'],
  Csound_Document: ['csd'],
  Csound_Orchestra: ['orc'],
  Csound_Score: ['sco'],
  CSS: ['css'],
  Curly: ['curly'],
  D: ['d|di'],
  Dart: ['dart'],
  Diff: ['diff|patch'],
  Dockerfile: ['^Dockerfile'],
  Dot: ['dot'],
  Drools: ['drl'],
  Edifact: ['edi'],
  Eiffel: ['e|ge'],
  EJS: ['ejs'],
  Elixir: ['ex|exs'],
  Elm: ['elm'],
  Erlang: ['erl|hrl'],
  Forth: ['frt|fs|ldr|fth|4th'],
  Fortran: ['f|f90'],
  FSharp: ['fsi|fs|ml|mli|fsx|fsscript'],
  FSL: ['fsl'],
  FTL: ['ftl'],
  Gcode: ['gcode'],
  Gherkin: ['feature'],
  Gitignore: ['^.gitignore'],
  Glsl: ['glsl|frag|vert'],
  Gobstones: ['gbs'],
  golang: ['go'],
  GraphQLSchema: ['gql'],
  Groovy: ['groovy'],
  HAML: ['haml'],
  Handlebars: ['hbs|handlebars|tpl|mustache'],
  Haskell: ['hs'],
  Haskell_Cabal: ['cabal'],
  haXe: ['hx'],
  Hjson: ['hjson'],
  HTML: ['html|htm|xhtml|vue|we|wpy'],
  HTML_Elixir: ['eex|html.eex'],
  HTML_Ruby: ['erb|rhtml|html.erb'],
  INI: ['ini|conf|cfg|prefs'],
  Io: ['io'],
  Jack: ['jack'],
  Jade: ['jade|pug'],
  Java: ['java'],
  JavaScript: ['js|jsm|jsx'],
  JSON: ['json'],
  JSON5: ['json5'],
  JSONiq: ['jq'],
  JSP: ['jsp'],
  JSSM: ['jssm|jssm_state'],
  JSX: ['jsx'],
  Julia: ['jl'],
  Kotlin: ['kt|kts'],
  LaTeX: ['tex|latex|ltx|bib'],
  LESS: ['less'],
  Liquid: ['liquid'],
  Lisp: ['lisp'],
  LiveScript: ['ls'],
  LogiQL: ['logic|lql'],
  LSL: ['lsl'],
  Lua: ['lua'],
  LuaPage: ['lp'],
  Lucene: ['lucene'],
  Makefile: ['^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make'],
  Markdown: ['md|markdown'],
  Mask: ['mask'],
  MATLAB: ['matlab'],
  Maze: ['mz'],
  MediaWiki: ['wiki|mediawiki'],
  MEL: ['mel'],
  MIXAL: ['mixal'],
  MUSHCode: ['mc|mush'],
  MySQL: ['mysql'],
  Nginx: ['nginx|conf'],
  Nim: ['nim'],
  Nix: ['nix'],
  NSIS: ['nsi|nsh'],
  Nunjucks: ['nunjucks|nunjs|nj|njk'],
  ObjectiveC: ['m|mm'],
  OCaml: ['ml|mli'],
  Pascal: ['pas|p'],
  Perl: ['pl|pm'],
  Perl6: ['p6|pl6|pm6'],
  pgSQL: ['pgsql'],
  PHP: ['php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module'],
  PHP_Laravel_blade: ['blade.php'],
  Pig: ['pig'],
  Powershell: ['ps1'],
  Praat: ['praat|praatscript|psc|proc'],
  Prisma: ['prisma'],
  Prolog: ['plg|prolog'],
  Properties: ['properties'],
  Protobuf: ['proto'],
  Puppet: ['epp|pp'],
  Python: ['py'],
  QML: ['qml'],
  R: ['r'],
  Razor: ['cshtml|asp'],
  RDoc: ['Rd'],
  Red: ['red|reds'],
  RHTML: ['Rhtml'],
  RST: ['rst'],
  Ruby: ['rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile'],
  Rust: ['rs'],
  SASS: ['sass'],
  SCAD: ['scad'],
  Scala: ['scala|sbt'],
  Scheme: ['scm|sm|rkt|oak|scheme'],
  SCSS: ['scss'],
  SH: ['sh|bash|^.bashrc'],
  SJS: ['sjs'],
  Slim: ['slim|skim'],
  Smarty: ['smarty|tpl'],
  snippets: ['snippets'],
  Soy_Template: ['soy'],
  Space: ['space'],
  SQL: ['sql'],
  SQLServer: ['sqlserver'],
  Stylus: ['styl|stylus'],
  SVG: ['svg'],
  Swift: ['swift'],
  Tcl: ['tcl'],
  Terraform: ['tf', 'tfvars', 'terragrunt'],
  Tex: ['tex'],
  Text: ['txt'],
  Textile: ['textile'],
  Toml: ['toml'],
  TSX: ['tsx'],
  Twig: ['latte|twig|swig'],
  Typescript: ['ts|typescript|str'],
  Vala: ['vala'],
  VBScript: ['vbs|vb'],
  Velocity: ['vm'],
  Verilog: ['v|vh|sv|svh'],
  VHDL: ['vhd|vhdl'],
  Visualforce: ['vfp|component|page'],
  Wollok: ['wlk|wpgm|wtest'],
  XML: ['xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml'],
  XQuery: ['xq'],
  YAML: ['yaml|yml'],
  Zeek: ['zeek|bro'],
  Django: ['html'],
}

const languages: Languages = {}

for (const lang in supportedLangs) {
  const patterns = supportedLangs[lang as keyof SupportedLanguages]

  languages[lang as keyof SupportedLanguages] = new RegExp(`^((${patterns.join(')(')}))$`, 'gi')
}

export const getLangFromPath = (path: string): KnownLanguages => {
  const fileName = path.split(/[/\\.]/).pop()

  if (!fileName) throw Error('[SUPPORTED LANGUAGES] Could not find file extension')

  let lang: KnownLanguages
  for (lang in languages) {
    if (fileName.match(languages[lang as keyof Languages] || /^$/)) return lang
  }

  return KnownLanguages.Text
}
