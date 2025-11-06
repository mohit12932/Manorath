import 'dart:async';
import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';
import '../../services/api_client.dart';
import 'signup_screen.dart';

class OtpScreen extends StatefulWidget {
  final String mobile;
  final String countryCode;
  final String mobileNumber;

  const OtpScreen({
    super.key,
    required this.mobile,
    required this.countryCode,
    required this.mobileNumber,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen>
    with SingleTickerProviderStateMixin {
  final _pinController = TextEditingController();
  final _focusNode = FocusNode();

  bool _isLoading = false;
  String? _errorMessage;
  int _resendTimer = 30;
  int _attemptsLeft = 3;
  bool _canResend = false;
  Timer? _timer;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startTimer();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );

    _animationController.forward();
  }

  void _startTimer() {
    _canResend = false;
    _resendTimer = 30;
    _timer?.cancel();

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendTimer > 0) {
        setState(() {
          _resendTimer--;
        });
      } else {
        setState(() {
          _canResend = true;
        });
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _pinController.dispose();
    _focusNode.dispose();
    _timer?.cancel();
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _handleVerifyOtp() async {
    if (_pinController.text.length != 6) {
      setState(() {
        _errorMessage = 'Please enter complete OTP';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      print('🔐 Verifying OTP for: ${widget.mobile}');
      print('🔑 OTP Code: ${_pinController.text}');

      // Call real backend API
      final response = await ApiClient().verifyOtp(
        widget.mobile,
        _pinController.text,
      );

      print('✅ Verify response: $response');

      if (!mounted) return;

      // Backend returns 'ok' not 'success'
      if (response['ok'] == true) {
        final data = response['data'] as Map<String, dynamic>?;
        // isNewUser is at the root of data, not inside user object
        final isNewUser = data?['isNewUser'] == true;

        print('👤 User status: ${isNewUser ? "New User" : "Existing User"}');
        print('📦 Response data: $data');

        if (isNewUser) {
          // New user - Navigate to signup screen to complete profile
          print('🆕 Redirecting to signup screen');
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => SignupScreen(
                mobile: widget.mobile,
                countryCode: widget.countryCode,
                mobileNumber: widget.mobileNumber,
              ),
            ),
          );
        } else {
          // Existing user - Navigate directly to dashboard
          print('✅ Redirecting to dashboard');
          Navigator.pushReplacementNamed(context, '/dashboard');
        }
      } else {
        setState(() {
          _attemptsLeft--;
          _errorMessage = response['message']?.toString() ?? 'Invalid OTP';
          _pinController.clear();

          if (_attemptsLeft <= 0) {
            _errorMessage = 'Maximum attempts reached. Please try again later.';
            Future.delayed(const Duration(seconds: 2), () {
              Navigator.pop(context);
            });
          }
        });
      }
    } catch (e) {
      print('❌ Verify error: $e');
      print('❌ Error type: ${e.runtimeType}');
      print('❌ Error details: ${e.toString()}');
      setState(() {
        _errorMessage = e
            .toString()
            .replaceAll('Exception: ', '')
            .replaceAll('ApiException: ', '');
        _pinController.clear();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _handleResendOtp() async {
    if (!_canResend) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      print('🔄 Resending OTP to: ${widget.mobile}');

      // Call real backend API
      final response = await ApiClient().requestOtp(widget.mobile);

      if (!mounted) return;

      if (response['ok'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('OTP sent successfully'),
            backgroundColor: Colors.green,
          ),
        );

        _startTimer();
        _pinController.clear();
      }
    } catch (e) {
      print('❌ Resend error: $e');
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final gradientColors = isDarkMode
        ? [const Color(0xFF020617), const Color(0xFF0B1220)]
        : [const Color(0xFF0F172A), const Color(0xFF1E3A8A)];

    final defaultPinTheme = PinTheme(
      width: 56,
      height: 56,
      textStyle: TextStyle(
        fontSize: 22,
        color: Theme.of(context).textTheme.bodyLarge?.color,
        fontWeight: FontWeight.w600,
      ),
      decoration: BoxDecoration(
        color: isDarkMode ? Colors.grey[850] : Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withOpacity(0.3)),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyWith(
      decoration: BoxDecoration(
        color: isDarkMode ? Colors.grey[850] : Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: gradientColors[0], width: 2),
      ),
    );

    final submittedPinTheme = defaultPinTheme.copyWith(
      decoration: BoxDecoration(
        color: gradientColors[0].withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: gradientColors[0]),
      ),
    );

    return Scaffold(
      body: Stack(
        children: [
          // Gradient Header
          Container(
            height: MediaQuery.of(context).size.height * 0.3,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradientColors,
              ),
            ),
          ),

          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Column(
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.white,
                          ),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.2),
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'Verify OTP',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Enter the 6-digit code sent to\n${widget.mobile}',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Form Section
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                      ),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const SizedBox(height: 32),

                            // OTP Input
                            Center(
                              child: Pinput(
                                controller: _pinController,
                                focusNode: _focusNode,
                                length: 6,
                                defaultPinTheme: defaultPinTheme,
                                focusedPinTheme: focusedPinTheme,
                                submittedPinTheme: submittedPinTheme,
                                autofocus: true,
                                onCompleted: (pin) => _handleVerifyOtp(),
                                hapticFeedbackType:
                                    HapticFeedbackType.lightImpact,
                              ),
                            ),

                            const SizedBox(height: 24),

                            // Attempts Left
                            if (_attemptsLeft < 3)
                              Center(
                                child: Text(
                                  'Attempts left: $_attemptsLeft',
                                  style: TextStyle(
                                    color: _attemptsLeft <= 1
                                        ? Colors.red
                                        : Colors.orange,
                                    fontSize: 14,
                                  ),
                                ),
                              ),

                            // Error Message
                            if (_errorMessage != null) ...[
                              const SizedBox(height: 16),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.red.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Colors.red.withOpacity(0.3),
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.error_outline,
                                      color: Colors.red,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        _errorMessage!,
                                        style: const TextStyle(
                                          color: Colors.red,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],

                            const SizedBox(height: 32),

                            // Verify Button
                            SizedBox(
                              height: 56,
                              child: ElevatedButton(
                                onPressed: _isLoading ? null : _handleVerifyOtp,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: gradientColors[0],
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  elevation: 0,
                                ),
                                child: _isLoading
                                    ? const SizedBox(
                                        height: 24,
                                        width: 24,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor:
                                              AlwaysStoppedAnimation<Color>(
                                                Colors.white,
                                              ),
                                        ),
                                      )
                                    : const Text(
                                        'Verify OTP',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                              ),
                            ),

                            const SizedBox(height: 24),

                            // Resend OTP
                            Center(
                              child: _canResend
                                  ? TextButton(
                                      onPressed: _handleResendOtp,
                                      child: Text(
                                        'Resend OTP',
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: gradientColors[0],
                                        ),
                                      ),
                                    )
                                  : Text(
                                      'Resend in $_resendTimer seconds',
                                      style: TextStyle(
                                        fontSize: 15,
                                        color: Colors.grey,
                                      ),
                                    ),
                            ),

                            const SizedBox(height: 16),

                            // Change Number
                            Center(
                              child: TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: Text(
                                  'Change number',
                                  style: TextStyle(
                                    fontSize: 15,
                                    color: Colors.grey,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
