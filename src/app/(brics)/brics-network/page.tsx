"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  localDb,
  StoredFarmerPost,
  FarmerPostComment,
  DEFAULT_FARMER_POSTS,
} from "@/lib/db/localStorageDb";
import {
  BRICS_SHARED_MODELS,
  BricsSharedModel,
  runBricsModelSimulation,
} from "@/lib/services/bricsModelsService";
import { DEMO_BRICS_COUNTRIES } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import {
  Globe2,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
  Download,
  Play,
  Sliders,
  X,
  Layers,
  Sprout,
  Droplets,
  Bug,
  ThermometerSnowflake,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type MainTab = "commons" | "models" | "macro";

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  BR: "Brazil",
  RU: "Russia",
  CN: "China",
  ZA: "South Africa",
};

export default function BricsNetworkPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<MainTab>("commons");

  // ---------------------------------------------------------------------------
  // TAB 1: FARMER COMMONS STATE
  // ---------------------------------------------------------------------------
  const [posts, setPosts] = useState<StoredFarmerPost[]>(DEFAULT_FARMER_POSTS);
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // New Post Form State
  const [formAuthor, setFormAuthor] = useState("");
  const [formCountry, setFormCountry] = useState<"IN" | "BR" | "RU" | "CN" | "ZA">("IN");
  const [formRegion, setFormRegion] = useState("");
  const [formCrop, setFormCrop] = useState("");
  const [formCategory, setFormCategory] = useState<StoredFarmerPost["category"]>("Regenerative");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formWaterSaved, setFormWaterSaved] = useState("");
  const [formYieldChange, setFormYieldChange] = useState("");
  const [formChemReduction, setFormChemReduction] = useState("");
  const [formCostSaved, setFormCostSaved] = useState("");

  // ---------------------------------------------------------------------------
  // TAB 2: MODELS REGISTRY STATE
  // ---------------------------------------------------------------------------
  const [selectedModelCategory, setSelectedModelCategory] = useState<string>("ALL");
  const [activeSimulationModel, setActiveSimulationModel] = useState<BricsSharedModel | null>(null);
  const [simulationInputs, setSimulationInputs] = useState<Record<string, number | string>>({});
  const [simulationOutputs, setSimulationOutputs] = useState<Record<string, string> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Load session & posts from localDb
  useEffect(() => {
    try {
      const storedPosts = localDb.getFarmerPosts();
      if (storedPosts && storedPosts.length > 0) {
        setPosts(storedPosts);
      }
      const session = localDb.getActiveSession();
      if (session.user) {
        setFormAuthor(session.user.name || "Ram Singh");
        setFormCountry(session.user.country || "IN");
        setFormRegion(session.user.region || "Jaipur Zone, Rajasthan");
      }
    } catch {
      setPosts(DEFAULT_FARMER_POSTS);
    }
  }, []);

  // Filtered Farmer Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCountry !== "ALL" && p.country !== selectedCountry) return false;
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesContent = p.content.toLowerCase().includes(q);
        const matchesCrop = p.cropFocus.toLowerCase().includes(q);
        const matchesRegion = p.region.toLowerCase().includes(q);
        const matchesAuthor = p.authorName.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesCrop && !matchesRegion && !matchesAuthor && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedCountry, selectedCategory, searchQuery]);

  // Upvote Action
  const handleToggleUpvote = (postId: string) => {
    const updated = localDb.togglePostUpvote(postId);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    } else {
      // Local fallback
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const up = p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1;
            return { ...p, upvotes: Math.max(0, up), userUpvoted: !p.userUpvoted };
          }
          return p;
        })
      );
    }
  };

  // Add Comment Action
  const handleAddComment = (postId: string) => {
    const text = (newCommentText[postId] || "").trim();
    if (!text) return;

    const session = localDb.getActiveSession();
    const commentPayload: { author: string; country: "IN" | "BR" | "RU" | "CN" | "ZA"; region: string; content: string } = {
      author: session.user?.name || "Ram Singh",
      country: session.user?.country || "IN",
      region: session.user?.region || "Rajasthan",
      content: text,
    };

    const updated = localDb.addPostComment(postId, commentPayload);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    } else {
      const fallbackComment: FarmerPostComment = {
        id: `cm-${Date.now().toString().slice(-5)}`,
        author: commentPayload.author,
        country: commentPayload.country,
        region: commentPayload.region,
        content: commentPayload.content,
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), fallbackComment] } : p))
      );
    }

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  // Toggle Comment Thread Expansion
  const toggleCommentsExpansion = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Copy Post Link
  const handleCopyPostLink = (post: StoredFarmerPost) => {
    const text = `[BRICS Agri-Net] ${post.title} (${COUNTRY_NAMES[post.country] || post.country}) - CADS Ref: ${
      post.cadRefId || "N/A"
    }`;
    navigator.clipboard.writeText(text);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // Submit New Farmer Publication
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const metricsPayload: StoredFarmerPost["metrics"] = {};
    if (formWaterSaved) metricsPayload.waterSavedPercent = parseFloat(formWaterSaved);
    if (formYieldChange) metricsPayload.yieldChangePercent = parseFloat(formYieldChange);
    if (formChemReduction) metricsPayload.chemicalReductionPercent = parseFloat(formChemReduction);
    if (formCostSaved) metricsPayload.costSavedPerHa = formCostSaved;

    const saved = localDb.saveFarmerPost({
      authorName: formAuthor.trim() || "Ram Singh",
      country: formCountry,
      region: formRegion.trim() || "Agricultural Zone",
      cropFocus: formCrop.trim() || "Field Crops",
      category: formCategory,
      title: formTitle.trim(),
      content: formContent.trim(),
      cadRefId: `CADS-${formCountry}-${formCrop.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      tags: tagsArray.length > 0 ? tagsArray : ["DirectPractice", "FarmerCommons"],
      metrics: Object.keys(metricsPayload).length > 0 ? metricsPayload : undefined,
    });

    setPosts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
    setIsPublishModalOpen(false);

    // Reset fields
    setFormTitle("");
    setFormContent("");
    setFormCrop("");
    setFormTags("");
    setFormWaterSaved("");
    setFormYieldChange("");
    setFormChemReduction("");
    setFormCostSaved("");
  };

  // Open Simulation Modal
  const handleOpenSimulation = (model: BricsSharedModel) => {
    setActiveSimulationModel(model);
    const initialInputs: Record<string, number | string> = {};
    model.inputParameters.forEach((param) => {
      initialInputs[param.name] = param.defaultValue;
    });
    setSimulationInputs(initialInputs);
    // Auto-run initial baseline simulation
    const initialOutputs = runBricsModelSimulation(model.id, initialInputs);
    setSimulationOutputs(initialOutputs);
  };

  // Run Simulation
  const handleExecuteSimulation = () => {
    if (!activeSimulationModel) return;
    setIsSimulating(true);
    setTimeout(() => {
      const outputs = runBricsModelSimulation(activeSimulationModel.id, simulationInputs);
      setSimulationOutputs(outputs);
      setIsSimulating(false);
    }, 250);
  };

  // Filtered Models
  const filteredModels = useMemo(() => {
    return BRICS_SHARED_MODELS.filter((m) => {
      if (selectedModelCategory === "ALL") return true;
      return m.category === selectedModelCategory;
    });
  }, [selectedModelCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-blue-100 text-blue-900 px-2.5 py-0.5 text-xs font-bold border border-blue-300">
                BRICS Agri-Net Cooperation
              </span>
              <span className="rounded bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-xs font-bold border border-emerald-300">
                CADS v1.0 Standard
              </span>
              <span className="text-xs text-slate-500 font-medium">5 Member States Active</span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Globe2 className="h-7 w-7 text-emerald-800 shrink-0" />
              BRICS Shared Data Models & Farmer Commons
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Open digital public platform connecting farmers, national agronomic institutes (EMBRAPA, ICAR, CAAS, RAS, ARC), and standardized CADS cross-border data telemetry for climate-resilient agriculture.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <Link
              href="/interoperability"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-800" />
              Open CADS Explorer
            </Link>

            <Link
              href="/farms"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              My Farm Telemetry <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Macro Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="gov-card p-4 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member States</div>
            <div className="mt-1.5 text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              5 <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">All Nodes Live</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600">IN • BR • RU • CN • ZA</p>
          </div>

          <div className="gov-card p-4 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Farmer Commons Posts</div>
            <div className="mt-1.5 text-2xl font-extrabold text-slate-900">{posts.length} Publications</div>
            <p className="mt-0.5 text-xs text-emerald-800 font-medium">Cross-border field solutions</p>
          </div>

          <div className="gov-card p-4 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shared Data Models</div>
            <div className="mt-1.5 text-2xl font-extrabold text-slate-900">{BRICS_SHARED_MODELS.length} Institutional</div>
            <p className="mt-0.5 text-xs text-slate-600">DPGA Open Science Standards</p>
          </div>

          <div className="gov-card p-4 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Privacy Protocol</div>
            <div className="mt-1.5 text-base font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Zero-PII Enforced
            </div>
            <p className="mt-0.5 text-xs text-slate-600">Spatial aggregation standard</p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6 text-sm font-bold" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("commons")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "commons"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Globe2 className="h-4 w-4" />
              Farmer Commons & Field Exchange ({posts.length})
            </button>

            <button
              onClick={() => setActiveTab("models")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "models"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Layers className="h-4 w-4" />
              Shared Data Models Registry ({BRICS_SHARED_MODELS.length})
            </button>

            <button
              onClick={() => setActiveTab("macro")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "macro"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Member State Macro Telemetry
            </button>
          </nav>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: FARMER COMMONS & FIELD EXCHANGE                             */}
        {/* =================================================================== */}
        {activeTab === "commons" && (
          <div className="space-y-6">
            {/* Action Bar & Filters */}
            <div className="gov-card p-4 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sprout className="h-4 w-4 text-emerald-800" />
                    Cross-Border Farmer Publications
                  </h2>
                  <span className="text-xs text-slate-500">
                    Showing {filteredPosts.length} of {posts.length} entries
                  </span>
                </div>

                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.commons.publishPractice}
                </button>
              </div>

              {/* Search & Country Quick-Filters */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search techniques, crops, authors, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Country Filter Pills */}
                <div className="md:col-span-8 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Nation:</span>
                  {[
                    { code: "ALL", label: `[ALL] ${t.common.all}` },
                    { code: "IN", label: "[IN] India" },
                    { code: "BR", label: "[BR] Brazil" },
                    { code: "RU", label: "[RU] Russia" },
                    { code: "CN", label: "[CN] China" },
                    { code: "ZA", label: "[ZA] South Africa" },
                  ].map((cty) => (
                    <button
                      key={cty.code}
                      onClick={() => setSelectedCountry(cty.code)}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                        selectedCountry === cty.code
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {cty.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs font-semibold text-slate-500 mr-1">Practice Area:</span>
                {[
                  "ALL",
                  "Regenerative",
                  "Water Conservation",
                  "Pest & Disease",
                  "Soil Health",
                  "Equipment & IoT",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="gov-card p-12 text-center border border-slate-200 space-y-3">
                <Globe2 className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No field practices match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the country filter or search keywords, or publish a new field practice from your farm.
                </p>
                <button
                  onClick={() => {
                    setSelectedCountry("ALL");
                    setSelectedCategory("ALL");
                    setSearchQuery("");
                  }}
                  className="rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const isExpanded = !!expandedComments[post.id];
                  const hasMetrics = post.metrics && Object.keys(post.metrics).length > 0;

                  return (
                    <div
                      key={post.id}
                      className="gov-card p-5 border border-slate-200 space-y-3.5 gov-card-hover"
                    >
                      {/* Post Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-emerald-400 font-mono font-bold text-xs tracking-wider border border-slate-700 shrink-0">
                            [{post.country}]
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded">
                                Verified Farmer
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {COUNTRY_NAMES[post.country] || post.country} • {post.region}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span>Crop Focus: <strong className="text-slate-700">{post.cropFocus}</strong></span>
                              <span>•</span>
                              <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                            {post.category}
                          </span>
                          {post.cadRefId && (
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-900 border border-blue-200">
                              {post.cadRefId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Post Title & Content */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{post.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      {/* Quantitative Impact Metrics (if present) */}
                      {hasMetrics && (
                        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex flex-wrap items-center gap-4 text-xs">
                          <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                            <TrendingUpIcon className="h-3.5 w-3.5 text-emerald-800" />
                            Measured Field Impact:
                          </span>

                          {post.metrics?.waterSavedPercent !== undefined && (
                            <div className="flex items-center gap-1 font-semibold text-emerald-900">
                              <Droplets className="h-3.5 w-3.5 text-blue-600" />
                              Water Saved: <span className="font-bold text-emerald-950">{post.metrics.waterSavedPercent}%</span>
                            </div>
                          )}

                          {post.metrics?.yieldChangePercent !== undefined && (
                            <div className="flex items-center gap-1 font-semibold text-emerald-900">
                              <Sprout className="h-3.5 w-3.5 text-emerald-700" />
                              Yield Change: <span className="font-bold text-emerald-950">+{post.metrics.yieldChangePercent}%</span>
                            </div>
                          )}

                          {post.metrics?.chemicalReductionPercent !== undefined && (
                            <div className="flex items-center gap-1 font-semibold text-emerald-900">
                              <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
                              Chemical Reduction: <span className="font-bold text-emerald-950">-{post.metrics.chemicalReductionPercent}%</span>
                            </div>
                          )}

                          {post.metrics?.costSavedPerHa && (
                            <div className="flex items-center gap-1 font-semibold text-emerald-900">
                              Cost Saved: <span className="font-bold text-emerald-950">{post.metrics.costSavedPerHa}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                              onClick={() => setSearchQuery(tag)}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Interaction Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleUpvote(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                              post.userUpvoted
                                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <ThumbsUp className={`h-3.5 w-3.5 ${post.userUpvoted ? "text-emerald-800" : "text-slate-500"}`} />
                            <span>{post.upvotes} Upvotes</span>
                          </button>

                          <button
                            onClick={() => toggleCommentsExpansion(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                            <span>{post.comments?.length || 0} Peer Discussion</span>
                            {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400" />}
                          </button>
                        </div>

                        <button
                          onClick={() => handleCopyPostLink(post)}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-medium"
                          title="Copy citation reference"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{copiedPostId === post.id ? "Copied" : "Share"}</span>
                        </button>
                      </div>

                      {/* Expandable Comments Section */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-slate-50/70 p-3.5 rounded-lg">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Cross-Border Discussion ({post.comments?.length || 0})
                          </h4>

                          {post.comments && post.comments.length > 0 ? (
                            <div className="space-y-2.5">
                              {post.comments.map((cm) => (
                                <div key={cm.id} className="p-2.5 rounded bg-white border border-slate-200 text-xs space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-800 px-1 rounded">
                                        [{cm.country}]
                                      </span>
                                      <strong className="text-slate-900">{cm.author}</strong>
                                      <span className="text-slate-500 text-[11px]">({cm.region})</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(cm.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{cm.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              No peer comments yet. Share your experience or ask a question below.
                            </p>
                          )}

                          {/* Add Comment Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="Write a response or query from your farm perspective..."
                              value={newCommentText[post.id] || ""}
                              onChange={(e) =>
                                setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post.id);
                              }}
                              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!(newCommentText[post.id] || "").trim()}
                              className="rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: BRICS SHARED DATA MODELS REGISTRY                           */}
        {/* =================================================================== */}
        {activeTab === "models" && (
          <div className="space-y-6">
            {/* Models Intro & Category Filter */}
            <div className="gov-card p-5 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-800" />
                    BRICS Institutional Agronomic Models
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Peer-reviewed, open-access mathematical equations and ML predictors published by member-state institutes under Digital Public Goods criteria.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded">
                    CADS v1.0 Interoperable
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 mr-1">Domain:</span>
                {[
                  { id: "ALL", label: "All Domains" },
                  { id: "Soil Carbon", label: "Soil Carbon Sequestration" },
                  { id: "Irrigation & Water", label: "Deficit Irrigation" },
                  { id: "Disease & Pest", label: "Canopy Spore & Disease" },
                  { id: "Climate Resilience", label: "Frost & Drought Resilience" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedModelCategory(cat.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                      selectedModelCategory === cat.id
                        ? "bg-emerald-800 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="gov-card p-5 border border-slate-200 space-y-4 flex flex-col justify-between gov-card-hover"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold text-sm tracking-wider border border-emerald-800 shrink-0">
                          [{model.country}]
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-800">{model.code}</span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              v{model.version}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                            {model.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Contributing Institution */}
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Institution:</span>
                        <span className="font-bold text-slate-900">{model.institution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Target Ecosystem:</span>
                        <span className="text-slate-800 text-right">{model.targetEcosystem}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Algorithm:</span>
                        <span className="font-mono text-[11px] text-slate-800">{model.algorithm}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {model.summary}
                    </p>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Benchmark Accuracy:</span>
                        <span className="font-bold text-emerald-800 mt-0.5 block">
                          {model.accuracyMetric.metric} = {model.accuracyMetric.value}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Calibration Scale:</span>
                        <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={model.trainingDatasetSize}>
                          {model.trainingDatasetSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenSimulation(model)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Run Live Simulation
                    </button>

                    <a
                      href={`/api/brics/models/${model.id}`}
                      download
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                      title="Download CADS model JSON specification"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Spec
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: MEMBER STATES MACRO TELEMETRY                               */}
        {/* =================================================================== */}
        {activeTab === "macro" && (
          <div className="space-y-6">
            <div className="gov-card p-5 border border-slate-200 space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-800" />
                Member State Macro Agricultural Profiles & Benchmarking
              </h2>
              <p className="text-xs text-slate-600">
                Aggregated national indicators compiled across BRICS national statistical offices and remote sensing telemetry nodes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEMO_BRICS_COUNTRIES.map((c) => {
                const isHigh = c.climateRisk === "High";
                const isMedium = c.climateRisk === "Medium";

                return (
                  <div key={c.code} className="gov-card p-5 border border-slate-200 space-y-4 gov-card-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-emerald-400 font-mono font-bold text-sm tracking-wider border border-slate-700 shrink-0">
                          [{c.code}]
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                            {c.name}
                          </h3>
                          <span className="text-xs text-slate-600 font-medium">Major Crop: {c.majorCrop}</span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                          isHigh
                            ? "bg-red-50 text-red-800 border-red-200"
                            : isMedium
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {c.climateRisk} Risk
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Mean Canopy NDVI:</span>
                        <p className="font-bold text-slate-900 mt-0.5">{c.avgNdvi}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Reporting Farms:</span>
                        <p className="font-bold text-slate-900 mt-0.5">{c.reportingFarms.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[11px] text-slate-500 block font-semibold">Primary Vulnerability:</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed">{c.topVulnerability}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Satellite Constellation Note */}
            <div className="gov-card p-5 border border-slate-200 bg-slate-900 text-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">BRICS Remote Sensing Constellation Interoperability</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vegetation canopy and soil moisture profiles are cross-calibrated using joint BRICS Earth observation satellites: CBERS-4 and CBERS-4A (China-Brazil Earth Resources Satellite), Kanopus-V (Russia), Resourcesat-2/2A (India), and Gaofen-1/6 (China).
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* PUBLISH MODAL: PUBLISH A FIELD PRACTICE TO FARMER COMMONS             */}
      {/* ===================================================================== */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="gov-card bg-white w-full max-w-2xl p-6 border border-slate-300 rounded-xl shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">Publish Practice to BRICS Farmer Commons</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublishPost} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name / Farm Lead</label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    placeholder="e.g. Ram Singh"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">BRICS Member State</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white"
                  >
                    <option value="IN">[IN] India</option>
                    <option value="BR">[BR] Brazil</option>
                    <option value="RU">[RU] Russia</option>
                    <option value="CN">[CN] China</option>
                    <option value="ZA">[ZA] South Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region / Zone</label>
                  <input
                    type="text"
                    required
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    placeholder="e.g. Jaipur Zone, Rajasthan"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Crop Tested</label>
                  <input
                    type="text"
                    required
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    placeholder="e.g. Mustard & Chickpea"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Practice Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white"
                  >
                    <option value="Regenerative">Regenerative Agriculture</option>
                    <option value="Water Conservation">Water Conservation & Irrigation</option>
                    <option value="Pest & Disease">Pest & Disease Biological Control</option>
                    <option value="Soil Health">Soil Health & Organic Matter</option>
                    <option value="Equipment & IoT">Equipment, Sensing & IoT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    placeholder="e.g. LaserLeveling, DeficitIrrigation, Mustard"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Practice Headline / Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  placeholder="e.g. Solar deficit drip schedule with sub-surface mulch cut tube well pumping by 41%"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Methodology & Agronomic Observations</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-800 leading-relaxed"
                  placeholder="Describe your implementation details, soil preparation, timing, irrigation intervals, biological treatments, and outcomes for fellow BRICS farmers..."
                />
              </div>

              {/* Quantitative Metrics Inputs */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Quantifiable Outcome Metrics (Optional but encouraged)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Water Saved (%)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={formWaterSaved}
                      onChange={(e) => setFormWaterSaved(e.target.value)}
                      placeholder="e.g. 41"
                      className="w-full px-2 py-1 rounded border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Yield Change (+%)</label>
                    <input
                      type="number"
                      step="1"
                      value={formYieldChange}
                      onChange={(e) => setFormYieldChange(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full px-2 py-1 rounded border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Chem Reduced (%)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={formChemReduction}
                      onChange={(e) => setFormChemReduction(e.target.value)}
                      placeholder="e.g. 35"
                      className="w-full px-2 py-1 rounded border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Cost Saved</label>
                    <input
                      type="text"
                      value={formCostSaved}
                      onChange={(e) => setFormCostSaved(e.target.value)}
                      placeholder="e.g. Rs 4,200/ha"
                      className="w-full px-2 py-1 rounded border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Publish to Commons
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SIMULATION MODAL: LIVE BRICS DATA MODEL EXECUTION                     */}
      {/* ===================================================================== */}
      {activeSimulationModel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="gov-card bg-white w-full max-w-2xl p-6 border border-slate-300 rounded-xl shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    [{activeSimulationModel.country}] {activeSimulationModel.code}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                    v{activeSimulationModel.version}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeSimulationModel.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveSimulationModel(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
              <p><strong>Institution:</strong> {activeSimulationModel.institution}</p>
              <p><strong>Algorithm:</strong> {activeSimulationModel.algorithm}</p>
            </div>

            {/* Input Sliders / Fields */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-emerald-800" />
                Simulation Input Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeSimulationModel.inputParameters.map((param) => (
                  <div key={param.name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-800">{param.name}</label>
                      <span className="font-mono text-emerald-800 font-bold">
                        {simulationInputs[param.name] ?? param.defaultValue} {param.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{param.description}</p>
                    <input
                      type="number"
                      step="any"
                      value={simulationInputs[param.name] ?? param.defaultValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSimulationInputs((prev) => ({
                          ...prev,
                          [param.name]: isNaN(val) ? e.target.value : val,
                        }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                onClick={handleExecuteSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {isSimulating ? "Computing Model Inference..." : "Recalculate Model Predictions"}
              </button>
            </div>

            {/* Simulation Outputs Card */}
            {simulationOutputs && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-800" />
                    Model Simulation Outputs
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">CADS Validated</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {Object.entries(simulationOutputs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded bg-white border border-emerald-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 mt-1 block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <a
                href={`/api/brics/models/${activeSimulationModel.id}`}
                download
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold"
              >
                <Download className="h-3.5 w-3.5" />
                Download Model Specification JSON
              </a>
              <button
                onClick={() => setActiveSimulationModel(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
