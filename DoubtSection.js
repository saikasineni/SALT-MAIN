import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  CheckCircle, 
  Trash2, 
  Search, 
  Filter,
  BookOpen,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Eye,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLocation } from "react-router-dom";
import { 
  getOfflineDoubts, 
  markDoubtResolved, 
  incrementDoubtReview, 
  deleteDoubt,
  getUnresolvedDoubtsCount 
} from "@/components/lib/offline";

export default function DoubtSection() {
  const location = useLocation();
  const [doubts, setDoubts] = useState([]);
  const [filteredDoubts, setFilteredDoubts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, resolved, unresolved

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const offlineMode = params.get('mode') === 'offline';
    setIsOffline(offlineMode);
    loadDoubts(offlineMode);
  }, [location.search]);

  const loadDoubts = async (offline = false) => {
    setLoading(true);
    try {
      if (offline) {
        const offlineDoubts = getOfflineDoubts();
        setDoubts(offlineDoubts);
        setFilteredDoubts(offlineDoubts);
      } else {
        const user = await base44.auth.me();
        const userDoubts = await base44.entities.Doubt.filter({ 
          student_id: user.id 
        }, '-created_date');
        setDoubts(userDoubts);
        setFilteredDoubts(userDoubts);
      }
    } catch (error) {
      console.error("Error loading doubts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...doubts];

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(d => d.subject === selectedSubject);
    }

    // Filter by resolution status
    if (filter === "resolved") {
      filtered = filtered.filter(d => d.resolved);
    } else if (filter === "unresolved") {
      filtered = filtered.filter(d => !d.resolved);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.chapter?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoubts(filtered);
  }, [doubts, selectedSubject, searchQuery, filter]);

  const handleMarkResolved = async (doubtId) => {
    if (isOffline) {
      markDoubtResolved(doubtId);
      loadDoubts(true);
    } else {
      try {
        await base44.entities.Doubt.update(doubtId, { resolved: true });
        loadDoubts(false);
      } catch (error) {
        console.error("Error marking doubt resolved:", error);
      }
    }
  };

  const handleDeleteDoubt = async (doubtId) => {
    if (confirm("Are you sure you want to delete this doubt?")) {
      if (isOffline) {
        deleteDoubt(doubtId);
        loadDoubts(true);
      } else {
        try {
          await base44.entities.Doubt.delete(doubtId);
          loadDoubts(false);
        } catch (error) {
          console.error("Error deleting doubt:", error);
        }
      }
    }
  };

  const handleViewDoubt = (doubt) => {
    setSelectedDoubt(doubt);
    
    // Increment review count
    if (isOffline) {
      incrementDoubtReview(doubt.id);
    } else {
      base44.entities.Doubt.update(doubt.id, { 
        reviewed_count: (doubt.reviewed_count || 0) + 1 
      }).catch(err => console.error("Error updating review count:", err));
    }
  };

  const subjects = [
    { id: "all", name: "All Subjects", color: "bg-gray-500" },
    { id: "mathematics", name: "Mathematics", color: "bg-blue-500" },
    { id: "science", name: "Science", color: "bg-green-500" },
    { id: "technology", name: "Technology", color: "bg-purple-500" },
    { id: "engineering", name: "Engineering", color: "bg-orange-500" }
  ];

  const unresolvedCount = doubts.filter(d => !d.resolved).length;
  const resolvedCount = doubts.filter(d => d.resolved).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your doubts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Doubt Section</h1>
              <p className="text-gray-600">Review wrong answers and learn from mistakes</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{unresolvedCount}</div>
                  <div className="text-sm text-gray-600">Unresolved Doubts</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
                  <div className="text-sm text-gray-600">Resolved Doubts</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{doubts.length}</div>
                  <div className="text-sm text-gray-600">Total Doubts</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search doubts by question, game, or chapter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="unresolved">Unresolved Only</option>
                  <option value="resolved">Resolved Only</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doubts List */}
        {filteredDoubts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedSubject !== "all" || filter !== "all" 
                  ? "No doubts match your filters" 
                  : "No doubts yet! 🎉"}
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedSubject !== "all" || filter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Keep playing games - doubts appear here when you answer incorrectly"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredDoubts.map((doubt, index) => (
                <motion.div
                  key={doubt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${
                    doubt.resolved ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${
                          doubt.resolved ? 'bg-green-500' : 'bg-orange-500'
                        } rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {doubt.resolved ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <HelpCircle className="w-6 h-6 text-white" />
                          )}
                        </div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-100 text-blue-800">
                                  {doubt.game_name}
                                </Badge>
                                <Badge variant="outline">
                                  {doubt.subject}
                                </Badge>
                                {doubt.chapter && (
                                  <Badge variant="outline" className="text-xs">
                                    {doubt.chapter}
                                  </Badge>
                                )}
                                {doubt.difficulty_level && (
                                  <Badge variant="outline" className="text-xs">
                                    {doubt.difficulty_level}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {doubt.question}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Reviewed {doubt.reviewed_count || 0} time{doubt.reviewed_count !== 1 ? 's' : ''}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              {!doubt.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkResolved(doubt.id)}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Resolved
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDoubt(doubt.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Your Answer (Wrong):</div>
                                <div className="text-sm font-medium text-red-600">
                                  ❌ {doubt.student_answer}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Correct Answer:</div>
                                <div className="text-sm font-medium text-green-600">
                                  ✓ {doubt.correct_answer}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDoubt(doubt)}
                            className="w-full md:w-auto"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Explanation
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detailed Doubt Modal */}
      <AnimatePresence>
        {selectedDoubt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDoubt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedDoubt.game_name}
                      </Badge>
                      <Badge variant="outline">
                        {selectedDoubt.subject}
                      </Badge>
                      {selectedDoubt.chapter && (
                        <Badge variant="outline">{selectedDoubt.chapter}</Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedDoubt.question}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDoubt(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </div>

                {/* All Options */}
                {selectedDoubt.options && selectedDoubt.options.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">All Options:</h3>
                    <div className="space-y-2">
                      {selectedDoubt.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-2 ${
                            option === selectedDoubt.correct_answer
                              ? 'bg-green-50 border-green-500'
                              : option === selectedDoubt.student_answer
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              option === selectedDoubt.correct_answer
                                ? 'bg-green-500 text-white'
                                : option === selectedDoubt.student_answer
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="font-medium">{option}</span>
                            {option === selectedDoubt.correct_answer && (
                              <Badge className="ml-auto bg-green-500">Correct ✓</Badge>
                            )}
                            {option === selectedDoubt.student_answer && (
                              <Badge className="ml-auto bg-red-500">Your Answer ✗</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Explanation */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Detailed Explanation:</h3>
                  </div>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedDoubt.explanation}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!selectedDoubt.resolved && (
                    <Button
                      onClick={() => {
                        handleMarkResolved(selectedDoubt.id);
                        setSelectedDoubt(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDoubt(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}