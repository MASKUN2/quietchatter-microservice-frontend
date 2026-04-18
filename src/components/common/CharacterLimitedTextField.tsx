"use client";

import React from 'react';
import type { TextFieldProps } from '@mui/material';
import { TextField, Box, Typography } from '@mui/material';

export type CharacterLimitedTextFieldProps = Omit<TextFieldProps, 'error'> & {
    maxLength: number;
    value: string;
};

const CharacterLimitedTextField: React.FC<CharacterLimitedTextFieldProps> = ({ maxLength, value, ...props }) => {
    const currentLength = value.length;
    const isExceeded = currentLength > maxLength;

    // Safely extract mb if it exists on sx, otherwise use default 2
    const sxObj = props.sx as Record<string, unknown>;
    const marginBottom = sxObj?.mb !== undefined ? sxObj.mb : 2;

    return (
        <Box sx={{ width: props.fullWidth ? '100%' : 'auto', mb: marginBottom }}>
            <TextField
                {...props}
                value={value}
                error={isExceeded}
                slotProps={{
                    ...props.slotProps,
                    htmlInput: {
                        ...props.slotProps?.htmlInput,
                        maxLength,
                    },
                }}
                sx={{ mb: 0, '& .MuiFormHelperText-root': { mx: 0 } }}
                helperText={
                    <Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 0.5 }}>
                        <Typography variant="caption" color={isExceeded ? 'error' : 'textSecondary'}>
                            {currentLength}/{maxLength}
                        </Typography>
                    </Box>
                }
            />
        </Box>
    );
};

export default CharacterLimitedTextField;
